import { expect, test } from "bun:test"
import { storyRead } from "@/cli/core/storyRead"
import type { ConfigType } from "@/cli/data/ConfigType"
import type { Result } from "~utils/result/Result"

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

const existingStoryFilename = "taski_cli.md"

const testConfig: ConfigType = {
	tasksFile: "/home/david/Coding/personal-taski-cli/.taski/tasks.json",
	storiesFolder: "/home/david/Coding/personal-taski-cli/.taski/stories",
}

test("readStory parses existing story correctly", async () => {
	const result = await storyRead(testConfig, existingStoryFilename)
	expect(result.success).toBe(true)
	assertOk(result)
	const story = result.data
	expect(story.title).toBe("Taski CLI Tool")
	expect(story.description).toContain("CLI tool")
	expect(Array.isArray(story.goals)).toBe(true)
	expect(story.goals.length).toBeGreaterThan(0)
	expect(Array.isArray(story.userTasks)).toBe(true)
	expect(story.userTasks.includes("S-001")).toBe(true)
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
	const story = result.data
	expect(story.goals).toContain("Create a fully functional CLI tool for task/story management")
	expect(story.goals).toContain("Implement type-safe schemas with valibot validation")
})

test("readStory parses userTasks correctly", async () => {
	const result = await storyRead(testConfig, existingStoryFilename)
	expect(result.success).toBe(true)
	assertOk(result)
	const story = result.data
	expect(story.userTasks).toContain("S-001")
	expect(story.userTasks).toContain("S-002")
	expect(story.userTasks).toContain("S-003")
})
