import { storiesList } from "@/cli/core/stories/storiesList"
import { afterAll, beforeAll, expect, test } from "bun:test"
import { assertOk, getTestConfig, testAfterAll, testBeforeAll } from "../testHelpers"

const testConfig = getTestConfig()
const testStoriesPath = testConfig.storiesFolder

beforeAll(testBeforeAll)
afterAll(testAfterAll)

test("listStories returns all markdown filenames in stories folder", async () => {
  const result = await storiesList(testConfig)
  expect(result.success).toBe(true)
  assertOk(result)
  const stories = result.data
  expect(Array.isArray(stories)).toBe(true)
  expect(stories.length).toBeGreaterThanOrEqual(1)
  expect(stories.includes("listStories.md")).toBe(true)
})
