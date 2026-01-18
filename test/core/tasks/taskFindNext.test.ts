import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"
import { taskFindNext } from "@/cli/core/tasks/taskFindNext"
import { tasksRead } from "@/cli/core/tasks/tasksRead"
import { taskUpdate } from "@/cli/core/tasks/taskUpdate"
import type { ConfigType } from "@/cli/data/ConfigType"
import { afterAll, beforeAll, beforeEach, expect, test } from "bun:test"
import { writeFileSync } from "node:fs"
import { assertOk, getTestConfig, resetTasksFile, testAfterAll, testBeforeAll } from "../testHelpers"

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
      dir: "/test",
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
      dir: "/test",
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
      dir: "/test",
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
      dir: "/test",
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
      dir: "/test",
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
      dir: "/test",
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
