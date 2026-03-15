import { taskDelete } from "@/taski/tasks/logic/taskDelete"
import { tasksRead } from "@/taski/tasks/logic/tasksRead"
import { getTestConfig, resetTasksFile, testAfterAll, testBeforeAll } from "@/taski/utils/test/testHelpers"
import { afterAll, beforeAll, beforeEach, expect, test } from "bun:test"
import type { Result } from "~result"

function assertOk<T>(result: Result<T>): asserts result is Extract<typeof result, { success: true }> {
  if (!result.success) {
    throw new Error(`Expected success but got error: ${result.errorMessage}`)
  }
}

function assertErr<T>(result: Result<T>): asserts result is Extract<typeof result, { success: false }> {
  if (result.success) {
    throw new Error(`Expected error but got success`)
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

test("taskDelete removes task by ID", async () => {
  const initialResult = await tasksRead(testConfig)
  expect(initialResult.success).toBe(true)
  assertOk(initialResult)
  const initialTasks = initialResult.data
  const initialCount = initialTasks.length
  const result = await taskDelete(testConfig, "TEST-001")
  expect(result.success).toBe(true)
  assertOk(result)
  expect(result.data).toBe(true)
  const tasksResult = await tasksRead(testConfig)
  expect(tasksResult.success).toBe(true)
  assertOk(tasksResult)
  const tasks = tasksResult.data
  expect(tasks.length).toBe(initialCount - 1)
  expect(tasks.find((t) => t.id === "TEST-001")).toBeUndefined()
})

test("taskDelete returns error for non-existent task", async () => {
  const result = await taskDelete(testConfig, "NON-EXISTENT")
  expect(result.success).toBe(false)
  assertErr(result)
  expect(result.errorMessage).toContain('Task with id "NON-EXISTENT" not found')
})
