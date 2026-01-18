import { storyRead } from "@/cli/core/stories/storyRead"
import { storyUpdate } from "@/cli/core/stories/storyUpdate"
import type { ConfigType } from "@/cli/data/ConfigType"
import { beforeEach, expect, test } from "bun:test"
import { existsSync, rmSync, writeFileSync } from "node:fs"
import type { Result } from "~utils/result/Result"
import { getTestConfig } from "../testHelpers"

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

const testConfig: ConfigType = getTestConfig()
const testStoriesPath = testConfig.storiesFolder
const testStoryFilename = "test_update_story.md"

const initialContent = `# Story: Initial Title

## Description

This is the initial description text

## Goals

- Initial goal one
- Initial goal two

## User Tasks

### TEST-001: Initial task one
### TEST-002: Initial task two
`

beforeEach(() => {
  const testFile = `${testStoriesPath}/${testStoryFilename}`
  if (existsSync(testFile)) {
    rmSync(testFile)
  }
})

test("storyUpdate updates title field", async () => {
  const testFile = `${testStoriesPath}/${testStoryFilename}`
  writeFileSync(testFile, initialContent)

  const result = await storyUpdate(testConfig, testStoryFilename, { title: "Updated Title" })
  expect(result.success).toBe(true)
  assertOk(result)
  const updated = result.data
  expect(updated.title).toBe("Updated Title")

  const storyResult = await storyRead(testConfig, testStoryFilename)
  expect(storyResult.success).toBe(true)
  assertOk(storyResult)
  const story = storyResult.data
  expect(story.title).toBe("Updated Title")
})

test("storyUpdate updates description field", async () => {
  const testFile = `${testStoriesPath}/${testStoryFilename}`
  writeFileSync(testFile, initialContent)

  const result = await storyUpdate(testConfig, testStoryFilename, { description: "Updated description text" })
  expect(result.success).toBe(true)
  assertOk(result)
  expect(result.data.description).toBe("Updated description text")

  const storyResult = await storyRead(testConfig, testStoryFilename)
  expect(storyResult.success).toBe(true)
  assertOk(storyResult)
  expect(storyResult.data.description).toBe("Updated description text")
})

test("storyUpdate updates goals field", async () => {
  const testFile = `${testStoriesPath}/${testStoryFilename}`
  writeFileSync(testFile, initialContent)

  const result = await storyUpdate(testConfig, testStoryFilename, {
    goals: ["New goal one", "New goal two", "New goal three"],
  })
  expect(result.success).toBe(true)
  assertOk(result)
  expect(result.data.goals).toEqual(["New goal one", "New goal two", "New goal three"])

  const storyResult = await storyRead(testConfig, testStoryFilename)
  expect(storyResult.success).toBe(true)
  assertOk(storyResult)
  expect(storyResult.data.goals).toEqual(["New goal one", "New goal two", "New goal three"])
})

test("storyUpdate updates userTasks field", async () => {
  const testFile = `${testStoriesPath}/${testStoryFilename}`
  writeFileSync(testFile, initialContent)

  const result = await storyUpdate(testConfig, testStoryFilename, { userTasks: ["S-101", "S-102"] })
  expect(result.success).toBe(true)
  assertOk(result)
  expect(result.data.userTasks).toEqual(["S-101", "S-102"])

  const storyResult = await storyRead(testConfig, testStoryFilename)
  expect(storyResult.success).toBe(true)
  assertOk(storyResult)
  expect(storyResult.data.userTasks).toEqual(["S-101", "S-102"])
})

test("storyUpdate performs partial update on existing story", async () => {
  const testFile = `${testStoriesPath}/${testStoryFilename}`
  writeFileSync(testFile, initialContent)

  const result = await storyUpdate(testConfig, testStoryFilename, { title: "Partially Updated Title" })
  expect(result.success).toBe(true)
  assertOk(result)
  const updated = result.data
  expect(updated.title).toBe("Partially Updated Title")
  expect(updated.description).toBe("This is the initial description text")
  expect(updated.goals).toEqual(["Initial goal one", "Initial goal two"])
  expect(updated.userTasks).toEqual(["TEST-001", "TEST-002"])
})

test("storyUpdate returns error for non-existent story", async () => {
  const result = await storyUpdate(testConfig, "non_existent_story.md", { title: "Test" })
  expect(result.success).toBe(false)
  assertErr(result)
  expect(result.errorMessage).toContain('Story "non_existent_story.md" not found')
})

test("storyUpdate works with .md extension provided", async () => {
  const testFile = `${testStoriesPath}/${testStoryFilename}`
  writeFileSync(testFile, initialContent)

  const result = await storyUpdate(testConfig, `${testStoryFilename}`, { title: "Title With Extension" })
  expect(result.success).toBe(true)
  assertOk(result)
  expect(result.data.title).toBe("Title With Extension")
})

test("storyUpdate updates all fields at once", async () => {
  const testFile = `${testStoriesPath}/${testStoryFilename}`
  writeFileSync(testFile, initialContent)

  const result = await storyUpdate(testConfig, testStoryFilename, {
    title: "Complete Update Title",
    description: "Complete update description",
    goals: ["Complete goal one", "Complete goal two"],
    userTasks: ["S-201", "S-202", "S-203"],
  })

  expect(result.success).toBe(true)
  assertOk(result)
  const updated = result.data
  expect(updated.title).toBe("Complete Update Title")
  expect(updated.description).toBe("Complete update description")
  expect(updated.goals).toEqual(["Complete goal one", "Complete goal two"])
  expect(updated.userTasks).toEqual(["S-201", "S-202", "S-203"])

  const storyResult = await storyRead(testConfig, testStoryFilename)
  expect(storyResult.success).toBe(true)
  assertOk(storyResult)
  const story = storyResult.data
  expect(story.title).toBe("Complete Update Title")
  expect(story.description).toBe("Complete update description")
  expect(story.goals).toEqual(["Complete goal one", "Complete goal two"])
  expect(story.userTasks).toEqual(["S-201", "S-202", "S-203"])
})
