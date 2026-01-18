import { storiesList } from "@/cli/core/storiesList"
import { storyCreate } from "@/cli/core/storyCreate"
import { storyDelete } from "@/cli/core/storyDelete"
import { storyRead } from "@/cli/core/storyRead"
import { afterAll, beforeEach, expect, test } from "bun:test"
import { existsSync, rmSync } from "node:fs"

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

beforeEach(() => {
	const testFile = `${testStoriesPath}/${testStoryFilename}`
	if (existsSync(testFile)) {
		rmSync(testFile)
	}
})

afterAll(() => {
	const testFile = `${testStoriesPath}/${testStoryFilename}`
	if (existsSync(testFile)) {
		rmSync(testFile)
	}
})

test("createStory creates new story file", async () => {
	const storiesBefore = await storiesList()
	await storyCreate(testStoryFilename, testStoryContent)
	const storiesAfter = await storiesList()
	expect(storiesAfter.length).toBe(storiesBefore.length + 1)
	expect(storiesAfter.includes(testStoryFilename)).toBe(true)

	const story = await storyRead(testStoryFilename)
	expect(story.title).toBe("Test Story")
	expect(story.description).toContain("test story")
})

test("createStory appends .md extension if missing", async () => {
	const filenameWithoutExt = "another_test"
	await storyCreate(filenameWithoutExt, testStoryContent)
	const stories = await storiesList()
	expect(stories.includes(`${filenameWithoutExt}.md`)).toBe(true)
	await storyDelete(`${filenameWithoutExt}.md`)
})
