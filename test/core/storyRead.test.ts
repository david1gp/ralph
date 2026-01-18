import { expect, test } from "bun:test"
import { storyRead } from "@/cli/core/storyRead"

const existingStoryFilename = "taski_cli.md"

test("readStory parses existing story correctly", async () => {
	const story = await storyRead(existingStoryFilename)
	expect(story.title).toBe("Taski CLI Tool")
	expect(story.description).toContain("CLI tool")
	expect(Array.isArray(story.goals)).toBe(true)
	expect(story.goals.length).toBeGreaterThan(0)
	expect(Array.isArray(story.userTasks)).toBe(true)
	expect(story.userTasks.includes("S-001")).toBe(true)
})

test("readStory throws error for non-existent story", async () => {
	expect(storyRead("non_existent_story.md")).rejects.toThrow(
		'Story "non_existent_story.md" not found',
	)
})

test("readStory parses goals correctly", async () => {
	const story = await storyRead(existingStoryFilename)
	expect(story.goals).toContain("Create a fully functional CLI tool for task/story management")
	expect(story.goals).toContain("Implement type-safe schemas with valibot validation")
})

test("readStory parses userTasks correctly", async () => {
	const story = await storyRead(existingStoryFilename)
	expect(story.userTasks).toContain("S-001")
	expect(story.userTasks).toContain("S-002")
	expect(story.userTasks).toContain("S-003")
})
