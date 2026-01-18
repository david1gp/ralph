import { storiesList } from "@/cli/core/storiesList"
import { storyCreate } from "@/cli/core/storyCreate"
import { storyDelete } from "@/cli/core/storyDelete"
import { storyRead } from "@/cli/core/storyRead"
import { afterAll, beforeAll, beforeEach, expect, test } from "bun:test"
import { existsSync, rmSync } from "node:fs"
import { getTestConfig, assertOk, testBeforeAll, testAfterAll, resetTasksFile } from "../testHelpers"

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
	const storiesBeforeResult = await storiesList(testConfig)
	expect(storiesBeforeResult.success).toBe(true)
	assertOk(storiesBeforeResult)
	const storiesBefore = storiesBeforeResult.data
	await storyCreate(testConfig, testStoryFilename, testStoryContent)
	const storiesAfterResult = await storiesList(testConfig)
	expect(storiesAfterResult.success).toBe(true)
	assertOk(storiesAfterResult)
	const storiesAfter = storiesAfterResult.data
	expect(storiesAfter.length).toBe(storiesBefore.length + 1)
	expect(storiesAfter.includes(testStoryFilename)).toBe(true)

	const storyResult = await storyRead(testConfig, testStoryFilename)
	expect(storyResult.success).toBe(true)
	assertOk(storyResult)
	const story = storyResult.data
	expect(story.title).toBe("Test Story")
	expect(story.description).toContain("test story")
})

test("createStory appends .md extension if missing", async () => {
	const filenameWithoutExt = "another_test"
	await storyCreate(testConfig, filenameWithoutExt, testStoryContent)
	const storiesResult = await storiesList(testConfig)
	expect(storiesResult.success).toBe(true)
	assertOk(storiesResult)
	const stories = storiesResult.data
	expect(stories.includes(`${filenameWithoutExt}.md`)).toBe(true)
	await storyDelete(testConfig, `${filenameWithoutExt}.md`)
})
