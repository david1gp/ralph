import { expect, test, afterAll, beforeAll, beforeEach } from "bun:test"
import { rmSync, existsSync } from "node:fs"
import { storiesList } from "@/cli/core/storiesList"
import { storyCreate } from "@/cli/core/storyCreate"
import { storyDelete } from "@/cli/core/storyDelete"
import { getTestConfig, assertOk, assertErr, testBeforeAll, testAfterAll, resetTasksFile } from "../testHelpers"

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

const testConfig = getTestConfig()

beforeAll(testBeforeAll)
afterAll(testAfterAll)
beforeEach(resetTasksFile)

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
	await storyCreate(testConfig, testStoryFilename, testStoryContent)
	const storiesBeforeResult = await storiesList(testConfig)
	expect(storiesBeforeResult.success).toBe(true)
	assertOk(storiesBeforeResult)
	const storiesBefore = storiesBeforeResult.data
	const result = await storyDelete(testConfig, testStoryFilename)
	expect(result.success).toBe(true)
	assertOk(result)
	expect(result.data).toBe(true)
	const storiesAfterResult = await storiesList(testConfig)
	expect(storiesAfterResult.success).toBe(true)
	assertOk(storiesAfterResult)
	const storiesAfter = storiesAfterResult.data
	expect(storiesAfter.length).toBe(storiesBefore.length - 1)
	expect(storiesAfter.includes(testStoryFilename)).toBe(false)
})

test("deleteStory returns error for non-existent story", async () => {
	const result = await storyDelete(testConfig, "non_existent_story.md")
	expect(result.success).toBe(false)
	assertErr(result)
	expect(result.errorMessage).toContain('Story "non_existent_story.md" not found')
})
