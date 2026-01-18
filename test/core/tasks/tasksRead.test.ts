import { tasksRead } from "@/cli/core/tasks/tasksRead"
import { afterAll, beforeAll, beforeEach, expect, test } from "bun:test"
import { rmSync } from "node:fs"
import type { Result } from "~utils/result/Result"
import { getTestConfig, resetTasksFile, testAfterAll, testBeforeAll } from "../testHelpers"

function assertOk<T>(result: Result<T>): asserts result is Extract<typeof result, { success: true }> {
  if (!result.success) {
    throw new Error(`Expected success but got error: ${result.errorMessage}`)
  }
}

const testConfig = getTestConfig()

beforeAll(() => {
  testBeforeAll()
})

afterAll(() => {
  testAfterAll()
})

beforeEach(() => {
  resetTasksFile()
})

test("tasksRead returns all tasks from tasks.json", async () => {
  const result = await tasksRead(testConfig)
  expect(result.success).toBe(true)
  assertOk(result)
  const tasks = result.data
  expect(tasks.length).toBe(2)
  expect(tasks[0]!.id).toBe("TEST-001")
  expect(tasks[1]!.id).toBe("TEST-002")
})

test("tasksRead returns empty array when file does not exist", async () => {
  rmSync(testConfig.tasksFile, { force: true })
  const result = await tasksRead(testConfig)
  expect(result.success).toBe(true)
  assertOk(result)
  expect(result.data).toEqual([])
  resetTasksFile()
})
