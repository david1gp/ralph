import type { ConfigType } from "@/taski/config/ConfigType"
import type { TaskType } from "@/taski/tasks/data/TaskType"
import { taskCreate } from "@/taski/tasks/logic/taskCreate"
import { tasksRead } from "@/taski/tasks/logic/tasksRead"
import { getTestConfig, resetTasksFile, testAfterAll, testBeforeAll } from "@/taski/utils/test/testHelpers"
import { afterAll, beforeAll, beforeEach, expect, test } from "bun:test"
import type { Result } from "~utils/result/Result"

function assertOk<T>(result: Result<T>): asserts result is Extract<typeof result, { success: true }> {
  if (!result.success) {
    throw new Error(`Expected success but got error: ${result.errorMessage}`)
  }
}

beforeAll(testBeforeAll)
afterAll(testAfterAll)
beforeEach(resetTasksFile)

const testConfig: ConfigType = getTestConfig()

test("taskCreate appends new task to tasks array", async () => {
  const initialResult = await tasksRead(testConfig)
  expect(initialResult.success).toBe(true)
  assertOk(initialResult)
  const initialTasks = initialResult.data
  const initialCount = initialTasks.length
  const newTask: TaskType = {
    id: "T-NEW",
    projectPath: "/home/david/Coding/test",
    story: "test-story.md",
    title: "New Task",
    description: "Newly created task",
    acceptanceCriteria: ["Test"],
    priority: 99,
    note: "",
  }
  const result = await taskCreate(testConfig, newTask)
  expect(result.success).toBe(true)
  assertOk(result)
  expect(result.data.id).toBe("T-NEW")
  const tasksResult = await tasksRead(testConfig)
  expect(tasksResult.success).toBe(true)
  assertOk(tasksResult)
  const tasks = tasksResult.data
  expect(tasks.length).toBe(initialCount + 1)
  expect(tasks[tasks.length - 1]!.id).toBe("T-NEW")
})

test("taskCreate initializes task with new fields", async () => {
  const newTask: TaskType = {
    id: "T-CREATE-TEST",
    projectPath: "/home/david/Coding/test",
    story: "test-story.md",
    title: "Create Test Task",
    description: "A task to test creation",
    acceptanceCriteria: ["Test"],
    priority: 100,
    note: "Initial note",
    startedAt: "2025-01-17T08:00:00.000Z",
    completedAt: undefined,
  }
  const result = await taskCreate(testConfig, newTask)
  expect(result.success).toBe(true)
  assertOk(result)
  expect(result.data.note).toBe("Initial note")
  expect(result.data.startedAt).toBe("2025-01-17T08:00:00.000Z")
  expect(result.data.completedAt).toBeUndefined()
})
