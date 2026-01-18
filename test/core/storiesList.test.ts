import { expect, test, beforeEach } from "bun:test"
import { storiesList } from "@/cli/core/storiesList"
import type { ConfigType } from "@/cli/data/ConfigType"
import type { Result } from "~utils/result/Result"

function assertOk<T>(result: Result<T>): asserts result is Extract<typeof result, { success: true }> {
	if (!result.success) {
		throw new Error(`Expected success but got error: ${result.errorMessage}`)
	}
}

const testStoriesPath = "/home/david/Coding/personal-taski-cli/.taski/stories"

const testConfig: ConfigType = {
	tasksFile: "/home/david/Coding/personal-taski-cli/.taski/tasks.json",
	storiesFolder: testStoriesPath,
}

test("listStories returns all markdown filenames in stories folder", async () => {
	const result = await storiesList(testConfig)
	expect(result.success).toBe(true)
	assertOk(result)
	const stories = result.data
	expect(Array.isArray(stories)).toBe(true)
	expect(stories.length).toBeGreaterThanOrEqual(1)
	expect(stories.includes("taski_cli.md")).toBe(true)
})
