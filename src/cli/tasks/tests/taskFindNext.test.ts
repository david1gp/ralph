import type { ConfigType } from "@/cli/config/ConfigType"
import { taskFindNext } from "@/cli/tasks/logic/taskFindNext"
import { tasksRead } from "@/cli/tasks/logic/tasksRead"
import { taskUpdate } from "@/cli/tasks/logic/taskUpdate"
import { assertOk, getTestConfig, resetTasksFile, testAfterAll, testBeforeAll } from "@/cli/utils/test/testHelpers"
import { afterAll, beforeAll, beforeEach, expect, test } from "bun:test"
import { writeFileSync } from "node:fs"
import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"

beforeAll(testBeforeAll)
afterAll(testAfterAll)
beforeEach(resetTasksFile)

const testConfig: ConfigType = getTestConfig()

test("taskFindNext returns highest priority incomplete task", async () => {
  const result = await taskFindNext(testConfig)
  expect(result.success).toBe(true)
  assertOk(result)
  const next = result.data
  expect(next).not.toBeUndefined()
  expect(next!.passes).toBe(false)
  expect(next!.id).toBe("TEST-002")
})

test("taskFindNext returns undefined when all tasks pass", async () => {
  const tasksResult = await tasksRead(testConfig)
  expect(tasksResult.success).toBe(true)
  assertOk(tasksResult)
  const tasks = tasksResult.data
  for (const task of tasks) {
    await taskUpdate(testConfig, task.id, { passes: true })
  }
  const result = await taskFindNext(testConfig)
  expect(result.success).toBe(true)
  assertOk(result)
  expect(result.data).toBeUndefined()
})

test("taskFindNext with same priority returns first in list", async () => {
  const tasksContent = jsonStringifyPretty([
    {
      id: "T1",
      projectPath: "/test",
      story: "/test/story.md",
      priority: 5,
      passes: false,
      title: "Task 1",
      description: "Desc",
      acceptanceCriteria: [],
      note: "",
    },
    {
      id: "T2",
      projectPath: "/test",
      story: "/test/story.md",
      priority: 5,
      passes: false,
      title: "Task 2",
      description: "Desc",
      acceptanceCriteria: [],
      note: "",
    },
    {
      id: "T3",
      projectPath: "/test",
      story: "/test/story.md",
      priority: 5,
      passes: false,
      title: "Task 3",
      description: "Desc",
      acceptanceCriteria: [],
      note: "",
    },
  ])
  writeFileSync(testConfig.tasksFile, tasksContent)
  const result = await taskFindNext(testConfig)
  expect(result.success).toBe(true)
  assertOk(result)
  expect(result.data!.id).toBe("T1")
})

test("taskFindNext higher priority wins over lower", async () => {
  const tasksContent = jsonStringifyPretty([
    {
      id: "LOW",
      projectPath: "/test",
      story: "/test/story.md",
      priority: 1,
      passes: false,
      title: "Low Priority",
      description: "Desc",
      acceptanceCriteria: [],
      note: "",
    },
    {
      id: "HIGH",
      projectPath: "/test",
      story: "/test/story.md",
      priority: 99,
      passes: false,
      title: "High Priority",
      description: "Desc",
      acceptanceCriteria: [],
      note: "",
    },
    {
      id: "MED",
      projectPath: "/test",
      story: "/test/story.md",
      priority: 50,
      passes: false,
      title: "Med Priority",
      description: "Desc",
      acceptanceCriteria: [],
      note: "",
    },
  ])
  writeFileSync(testConfig.tasksFile, tasksContent)
  const result = await taskFindNext(testConfig)
  expect(result.success).toBe(true)
  assertOk(result)
  expect(result.data!.id).toBe("HIGH")
})
