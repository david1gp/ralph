import { storyRead } from "@/cli/stories/logic/storyRead"
import { assertErr, assertOk, getTestConfig, testAfterAll, testBeforeAll } from "@/cli/utils/test/testHelpers"
import { afterAll, beforeAll, expect, test } from "bun:test"

const existingStoryFilename = "storyRead.md"

const testConfig = getTestConfig()

beforeAll(testBeforeAll)
afterAll(testAfterAll)

test("readStory returns story content as plain text", async () => {
  const result = await storyRead(testConfig, existingStoryFilename)
  expect(result.success).toBe(true)
  assertOk(result)
  const content = result.data
  expect(typeof content).toBe("string")
  expect(content).toContain("# Story: Taski CLI Tool")
  expect(content).toContain("## Description")
  expect(content).toContain("## Goals")
  expect(content).toContain("- Create a fully functional CLI tool for task/story management")
  expect(content).toContain("### S-001")
})

test("readStory returns error for non-existent story", async () => {
  const result = await storyRead(testConfig, "non_existent_story.md")
  expect(result.success).toBe(false)
  assertErr(result)
  expect(result.errorMessage).toContain('Story "non_existent_story.md" not found')
})

test("readStory parses goals correctly", async () => {
  const result = await storyRead(testConfig, existingStoryFilename)
  expect(result.success).toBe(true)
  assertOk(result)
  const content = result.data
  expect(content).toContain("Create a fully functional CLI tool for task/story management")
  expect(content).toContain("Implement type-safe schemas with valibot validation")
})

test("readStory parses userTasks correctly", async () => {
  const result = await storyRead(testConfig, existingStoryFilename)
  expect(result.success).toBe(true)
  assertOk(result)
  const content = result.data
  expect(content).toContain("### S-001")
  expect(content).toContain("### S-002")
  expect(content).toContain("### S-003")
})
