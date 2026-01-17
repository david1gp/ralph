import { expect, test, beforeEach } from "bun:test"
import { writeFileSync, rmSync, existsSync } from "node:fs"
import { storyUpdate } from "@/cli/core/storyUpdate"
import { storyRead } from "@/cli/core/storyRead"

const testStoriesPath = "/home/david/Coding/personal-taski-cli/stories"
const testStoryFilename = "test_update_story.md"

const initialContent = `# Story: Initial Title

## Description

This is the initial description text

## Goals

- Initial goal one
- Initial goal two

## User Tasks

### T-001: Initial task one
### T-002: Initial task two
`

beforeEach(() => {
	const testFile = `${testStoriesPath}/${testStoryFilename}`
	if (existsSync(testFile)) {
		rmSync(testFile)
	}
})

test("storyUpdate updates title field", () => {
	const testFile = `${testStoriesPath}/${testStoryFilename}`
	writeFileSync(testFile, initialContent)

	const updated = storyUpdate(testStoryFilename, { title: "Updated Title" })
	expect(updated.title).toBe("Updated Title")

	const story = storyRead(testStoryFilename)
	expect(story.title).toBe("Updated Title")
})

test("storyUpdate updates description field", () => {
	const testFile = `${testStoriesPath}/${testStoryFilename}`
	writeFileSync(testFile, initialContent)

	const updated = storyUpdate(testStoryFilename, { description: "Updated description text" })
	expect(updated.description).toBe("Updated description text")

	const story = storyRead(testStoryFilename)
	expect(story.description).toBe("Updated description text")
})

test("storyUpdate updates goals field", () => {
	const testFile = `${testStoriesPath}/${testStoryFilename}`
	writeFileSync(testFile, initialContent)

	const updated = storyUpdate(testStoryFilename, { goals: ["New goal one", "New goal two", "New goal three"] })
	expect(updated.goals).toEqual(["New goal one", "New goal two", "New goal three"])

	const story = storyRead(testStoryFilename)
	expect(story.goals).toEqual(["New goal one", "New goal two", "New goal three"])
})

test("storyUpdate updates userTasks field", () => {
	const testFile = `${testStoriesPath}/${testStoryFilename}`
	writeFileSync(testFile, initialContent)

	const updated = storyUpdate(testStoryFilename, { userTasks: ["S-101", "S-102"] })
	expect(updated.userTasks).toEqual(["S-101", "S-102"])

	const story = storyRead(testStoryFilename)
	expect(story.userTasks).toEqual(["S-101", "S-102"])
})

test("storyUpdate performs partial update on existing story", () => {
	const testFile = `${testStoriesPath}/${testStoryFilename}`
	writeFileSync(testFile, initialContent)

	const updated = storyUpdate(testStoryFilename, { title: "Partially Updated Title" })
	expect(updated.title).toBe("Partially Updated Title")
	expect(updated.description).toBe("This is the initial description text")
	expect(updated.goals).toEqual(["Initial goal one", "Initial goal two"])
	expect(updated.userTasks).toEqual(["T-001", "T-002"])
})

test("storyUpdate throws error for non-existent story", () => {
	expect(() => storyUpdate("non_existent_story.md", { title: "Test" })).toThrow(
		'Story "non_existent_story.md" not found',
	)
})

test("storyUpdate works with .md extension provided", () => {
	const testFile = `${testStoriesPath}/${testStoryFilename}`
	writeFileSync(testFile, initialContent)

	const updated = storyUpdate(`${testStoryFilename}`, { title: "Title With Extension" })
	expect(updated.title).toBe("Title With Extension")
})

test("storyUpdate updates all fields at once", () => {
	const testFile = `${testStoriesPath}/${testStoryFilename}`
	writeFileSync(testFile, initialContent)

	const updated = storyUpdate(testStoryFilename, {
		title: "Complete Update Title",
		description: "Complete update description",
		goals: ["Complete goal one", "Complete goal two"],
		userTasks: ["S-201", "S-202", "S-203"],
	})

	expect(updated.title).toBe("Complete Update Title")
	expect(updated.description).toBe("Complete update description")
	expect(updated.goals).toEqual(["Complete goal one", "Complete goal two"])
	expect(updated.userTasks).toEqual(["S-201", "S-202", "S-203"])

	const story = storyRead(testStoryFilename)
	expect(story.title).toBe("Complete Update Title")
	expect(story.description).toBe("Complete update description")
	expect(story.goals).toEqual(["Complete goal one", "Complete goal two"])
	expect(story.userTasks).toEqual(["S-201", "S-202", "S-203"])
})
