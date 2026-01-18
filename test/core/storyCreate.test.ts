import { storiesList } from "@/cli/core/storiesList"
import { storyCreate } from "@/cli/core/storyCreate"
import { storyDelete } from "@/cli/core/storyDelete"
import { storyRead } from "@/cli/core/storyRead"
import { afterAll, beforeEach, expect, test } from "bun:test"
import { existsSync, rmSync } from "node:fs"
import type { Result } from "~utils/result/Result"

function assertOk<T>(result: Result<T>): asserts result is Extract<typeof result, { success: true }> {
	if (!result.success) {
		throw new Error(`Expected success but got error: ${result.errorMessage}`)
	}
}

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
	const storiesBeforeResult = await storiesList()
	expect(storiesBeforeResult.success).toBe(true)
	assertOk(storiesBeforeResult)
	const storiesBefore = storiesBeforeResult.data
	await storyCreate(testStoryFilename, testStoryContent)
	const storiesAfterResult = await storiesList()
	expect(storiesAfterResult.success).toBe(true)
	assertOk(storiesAfterResult)
	const storiesAfter = storiesAfterResult.data
	expect(storiesAfter.length).toBe(storiesBefore.length + 1)
	expect(storiesAfter.includes(testStoryFilename)).toBe(true)

	const storyResult = await storyRead(testStoryFilename)
	expect(storyResult.success).toBe(true)
	assertOk(storyResult)
	const story = storyResult.data
	expect(story.title).toBe("Test Story")
	expect(story.description).toContain("test story")
})

test("createStory appends .md extension if missing", async () => {
	const filenameWithoutExt = "another_test"
	await storyCreate(filenameWithoutExt, testStoryContent)
	const storiesResult = await storiesList()
	expect(storiesResult.success).toBe(true)
	assertOk(storiesResult)
	const stories = storiesResult.data
	expect(stories.includes(`${filenameWithoutExt}.md`)).toBe(true)
	await storyDelete(`${filenameWithoutExt}.md`)
})
