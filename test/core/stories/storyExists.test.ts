import { storyExists } from "@/cli/utils/storyExists"
import { afterAll, beforeAll, beforeEach, expect, test } from "bun:test"
import { assertErr, assertOk, getTestConfig, resetTasksFile, testAfterAll, testBeforeAll } from "../testHelpers"
import { join } from "node:path"

const testConfig = getTestConfig()

beforeAll(testBeforeAll)
afterAll(testAfterAll)
beforeEach(resetTasksFile)

test("storyExists returns path for existing story with .md extension", async () => {
  const storyPath = join(testConfig.storiesFolder, "test_story.md")
  const result = await storyExists(testConfig, "test_story.md")
  expect(result.success).toBe(true)
  assertOk(result)
  expect(result.data).toBe(storyPath)
})

test("storyExists returns path for existing story without .md extension", async () => {
  const storyPath = join(testConfig.storiesFolder, "test_story.md")
  const result = await storyExists(testConfig, "test_story")
  expect(result.success).toBe(true)
  assertOk(result)
  expect(result.data).toBe(storyPath)
})

test("storyExists returns error for non-existent story", async () => {
  const result = await storyExists(testConfig, "non-existent-story")
  expect(result.success).toBe(false)
  assertErr(result)
  expect(result.errorMessage).toContain("not found")
})

test("storyExists returns empty string for empty input", async () => {
  const result = await storyExists(testConfig, "")
  expect(result.success).toBe(true)
  assertOk(result)
  expect(result.data).toBe("")
})
