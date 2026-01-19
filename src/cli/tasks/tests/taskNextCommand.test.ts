import { taskNextFunc } from "@/cli/tasks/cli/taskNextCommand"
import { tasksRead } from "@/cli/tasks/logic/tasksRead"
import { afterAll, beforeAll, beforeEach, expect, test } from "bun:test"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { parseJson, pipe, safeParse, string } from "valibot"
import {
  getTestConfig,
  resetTasksFile,
  testAfterAll,
  testBeforeAll,
} from "../../utils/test/testHelpers"

const __dirname = dirname(fileURLToPath(import.meta.url))
const testTaskiDir = join(__dirname, "..", "..", ".taski")

beforeAll(testBeforeAll)
afterAll(testAfterAll)
beforeEach(resetTasksFile)

function createMockContext() {
  const stdout: string[] = []
  const mockProcess = {
    stdout: {
      write: (data: string) => stdout.push(data),
    },
    exit: (code: number) => {
      throw new Error(`Process exited with code ${code}`)
    },
  }
  return {
    process: mockProcess,
    stdout,
  }
}

test("taskNextCommand with --start now sets startedAt to current time", async () => {
  const originalCwd = process.cwd()
  process.chdir(join(__dirname, "..", ".."))
  try {
    const { process: mockProcess, stdout } = createMockContext()
    const mockContext = { process: mockProcess } as any

    const beforeTest = new Date().toISOString()

    await taskNextFunc.call(mockContext, { start: "now", config: testTaskiDir })

    expect(stdout.length).toBe(1)
    const output = stdout[0]!
    const result = safeParse(pipe(string(), parseJson()), output)
    expect(result.success).toBe(true)
    const task = result.output as { id: string; startedAt?: string }
    expect(task.startedAt).toBeDefined()
    expect(new Date(task.startedAt!).getTime()).toBeGreaterThanOrEqual(new Date(beforeTest).getTime())
    expect(new Date(task.startedAt!).getTime()).toBeLessThanOrEqual(new Date().getTime())
    expect(task.id).toBe("TEST-002")

    const config = getTestConfig()
    const tasksResult = await tasksRead(config)
    expect(tasksResult.success).toBe(true)
    if (tasksResult.success) {
      const found = tasksResult.data.find((t) => t.id === task.id)
      expect(found!.startedAt).toBe(task.startedAt)
    }
  } finally {
    process.chdir(originalCwd)
  }
})

test("taskNextCommand with --start '' clears startedAt", async () => {
  const originalCwd = process.cwd()
  process.chdir(join(__dirname, "..", ".."))
  try {
    const { process: mockProcess, stdout } = createMockContext()
    const mockContext = { process: mockProcess } as any

    await taskNextFunc.call(mockContext, { start: "", config: testTaskiDir })

    expect(stdout.length).toBe(1)
    const output = stdout[0]!
    const result = safeParse(pipe(string(), parseJson()), output)
    expect(result.success).toBe(true)
    const task = result.output as { id: string; startedAt?: string }
    expect(task.startedAt).toBeUndefined()
    expect(task.id).toBe("TEST-002")

    const config = getTestConfig()
    const tasksResult = await tasksRead(config)
    expect(tasksResult.success).toBe(true)
    if (tasksResult.success) {
      const found = tasksResult.data.find((t) => t.id === task.id)
      expect(found!.startedAt).toBeUndefined()
    }
  } finally {
    process.chdir(originalCwd)
  }
})

test("taskNextCommand with --start '2025-01-17T10:00:00.000Z' sets specific timestamp", async () => {
  const originalCwd = process.cwd()
  process.chdir(join(__dirname, "..", ".."))
  try {
    const { process: mockProcess, stdout } = createMockContext()
    const mockContext = { process: mockProcess } as any

    const timestamp = "2025-01-17T10:00:00.000Z"
    await taskNextFunc.call(mockContext, { start: timestamp, config: testTaskiDir })

    expect(stdout.length).toBe(1)
    const output = stdout[0]!
    const result = safeParse(pipe(string(), parseJson()), output)
    expect(result.success).toBe(true)
    const task = result.output as { id: string; startedAt?: string }
    expect(task.startedAt).toBe(timestamp)
    expect(task.id).toBe("TEST-002")

    const config = getTestConfig()
    const tasksResult = await tasksRead(config)
    expect(tasksResult.success).toBe(true)
    if (tasksResult.success) {
      const found = tasksResult.data.find((t) => t.id === task.id)
      expect(found!.startedAt).toBe(timestamp)
    }
  } finally {
    process.chdir(originalCwd)
  }
})

test("taskNextCommand with --start 'invalid' prints error", async () => {
  const originalCwd = process.cwd()
  process.chdir(join(__dirname, "..", ".."))
  try {
    const { process: mockProcess } = createMockContext()
    const mockContext = { process: mockProcess } as any
    const consoleError = console.error
    const errorCalls: unknown[][] = []
    console.error = (...args: unknown[]) => {
      errorCalls.push(args)
    }

    const originalExit = process.exit
    process.exit = ((code: number) => {
      console.error = consoleError
      process.exit = originalExit
    }) as typeof process.exit

    await taskNextFunc.call(mockContext, { start: "invalid", config: testTaskiDir })

    expect(errorCalls.length).toBeGreaterThan(0)
    console.error = consoleError
  } finally {
    process.chdir(originalCwd)
  }
})

test("taskNextCommand without --start returns task without modification", async () => {
  const originalCwd = process.cwd()
  process.chdir(join(__dirname, "..", ".."))
  try {
    const { process: mockProcess, stdout } = createMockContext()
    const mockContext = { process: mockProcess } as any

    await taskNextFunc.call(mockContext, { config: testTaskiDir })

    expect(stdout.length).toBe(1)
    const output = stdout[0]!
    const result = safeParse(pipe(string(), parseJson()), output)
    expect(result.success).toBe(true)
    const task = result.output as { id: string; startedAt?: string }
    expect(task.startedAt).toBe("2025-02-15T08:00:00.000Z")
    expect(task.id).toBe("TEST-002")
  } finally {
    process.chdir(originalCwd)
  }
})
