import { storiesList } from "@/taski/stories/logic/storiesList"
import { assertOk, getTestConfig, testAfterAll, testBeforeAll } from "@/taski/utils/test/testHelpers"
import { afterAll, beforeAll, expect, test } from "bun:test"

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
