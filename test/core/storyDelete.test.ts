import { expect, test, afterAll, beforeEach } from "bun:test"
import { rmSync, existsSync } from "node:fs"
import { storiesList } from "@/cli/core/storiesList"
import { storyCreate } from "@/cli/core/storyCreate"
import { storyDelete } from "@/cli/core/storyDelete"

const testStoriesPath = "/home/david/Coding/personal-taski-cli/.taski/stories"
const testStoryFilename = "test_story.md"
const testStoryContent = `# Story: Test Story

## Description

This is a test story for unit testing purposes.

## Goals

- Test listStories function
- Test readStory function
- Test createStory function
- Test deleteStory function

## User Tasks

### T-TEST1: First test task
### T-TEST2: Second test task
### T-TEST3: Third test task
`

afterAll(() => {
	const testFile = `${testStoriesPath}/${testStoryFilename}`
	if (existsSync(testFile)) {
		rmSync(testFile)
	}
})

beforeEach(() => {
	const testFile = `${testStoriesPath}/${testStoryFilename}`
	if (existsSync(testFile)) {
		rmSync(testFile)
	}
})

test("deleteStory removes story file", async () => {
	await storyCreate(testStoryFilename, testStoryContent)
	const storiesBefore = await storiesList()
	const result = await storyDelete(testStoryFilename)
	expect(result).toBe(true)
	const storiesAfter = await storiesList()
	expect(storiesAfter.length).toBe(storiesBefore.length - 1)
	expect(storiesAfter.includes(testStoryFilename)).toBe(false)
})

test("deleteStory returns false for non-existent story", async () => {
	const result = await storyDelete("non_existent_story.md")
	expect(result).toBe(false)
})
