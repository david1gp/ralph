import { expect, test, beforeAll, afterAll } from "bun:test"
import { storiesList } from "@/cli/core/storiesList"
import { getTestConfig, assertOk, testBeforeAll, testAfterAll } from "../testHelpers"

const testStoriesPath = "/home/david/Coding/personal-taski-cli/.taski/stories"

const testConfig = getTestConfig()

beforeAll(testBeforeAll)
afterAll(testAfterAll)

test("listStories returns all markdown filenames in stories folder", async () => {
	const result = await storiesList(testConfig)
	expect(result.success).toBe(true)
	assertOk(result)
	const stories = result.data
	expect(Array.isArray(stories)).toBe(true)
	expect(stories.length).toBeGreaterThanOrEqual(1)
	expect(stories.includes("taski_cli.md")).toBe(true)
})
