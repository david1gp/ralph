import { expect, test } from "bun:test"
import { taskSchema, taskValidate } from "@/cli/data/taskValidate"
import { storySchema, storyValidate } from "@/cli/data/storyValidate"

test("taskSchema validates correct task data", () => {
  const validTask = {
    id: "TEST-001",
    projectDir: "/home/david/Coding/project",
    story: "test-story.md",
    title: "Test Task",
    description: "A test task",
    acceptanceCriteria: ["Criterion 1", "Criterion 2"],
    priority: 1,
    passes: false,
    note: "Some notes",
  }
  const result = taskValidate(JSON.stringify(validTask))
  expect(result.success).toBe(true)
})

test("taskSchema rejects missing required fields", () => {
  const invalidTask = {
    id: "TEST-001",
    projectDir: "/home/david/Coding/project",
    title: "Test Task",
  }
  const result = taskValidate(JSON.stringify(invalidTask))
  expect(result.success).toBe(false)
})

test("taskSchema accepts passes as true or false", () => {
  const taskTrue = {
    id: "TEST-001",
    projectDir: "/home/david/Coding/project",
    story: "test-story.md",
    title: "Test Task",
    description: "A test task",
    acceptanceCriteria: [],
    priority: 1,
    passes: true,
  }
  const taskFalse = {
    id: "TEST-001",
    projectDir: "/home/david/Coding/project",
    story: "test-story.md",
    title: "Test Task",
    description: "A test task",
    acceptanceCriteria: [],
    priority: 1,
    passes: false,
  }
  const resultTrue = taskValidate(JSON.stringify(taskTrue))
  const resultFalse = taskValidate(JSON.stringify(taskFalse))
  expect(resultTrue.success).toBe(true)
  expect(resultFalse.success).toBe(true)
})

test("storySchema validates correct story data", () => {
  const validStory = {
    title: "Test Story",
    description: "A description",
    goals: ["Goal 1", "Goal 2"],
    userTasks: ["S-001", "S-002"],
    projectDir: "/home/david/Coding/project",
  }
  const result = storyValidate(JSON.stringify(validStory))
  expect(result.success).toBe(true)
})

test("storySchema rejects missing required fields", () => {
  const invalidStory = {
    title: "Test Story",
    description: "A description",
  }
  const result = storyValidate(JSON.stringify(invalidStory))
  expect(result.success).toBe(false)
})
