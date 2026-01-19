import { storyParse } from "@/cli/stories/data/storyParse"
import { taskParse } from "@/cli/tasks/data/taskParse"
import { expect, test } from "bun:test"

test("taskParse returns success for valid data", () => {
  const validTask = {
    id: "TEST-001",
    projectPath: "/home/david/Coding/project",
    story: "test-story.md",
    title: "Test Task",
    description: "A test task",
    acceptanceCriteria: ["Criterion 1"],
    priority: 1,
    passes: false,
  }
  const result = taskParse(validTask)
  expect(result.success).toBe(true)
  if (result.success) {
    expect(result.data.id).toBe("TEST-001")
  }
})

test("taskParse returns failure for invalid data", () => {
  const invalidTask = {
    id: "TEST-001",
  }
  const result = taskParse(invalidTask)
  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.issues).toBeDefined()
  }
})

test("storyParse returns success for valid data", () => {
  const validStory = {
    title: "Test Story",
    description: "A description",
    goals: ["Goal 1"],
    userTasks: ["S-001"],
    projectPath: "/home/david/Coding/project",
  }
  const result = storyParse(validStory)
  expect(result.success).toBe(true)
  if (result.success) {
    expect(result.data.title).toBe("Test Story")
  }
})

test("storyParse returns failure for invalid data", () => {
  const invalidStory = {
    title: "Test Story",
  }
  const result = storyParse(invalidStory)
  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.issues).toBeDefined()
  }
})
