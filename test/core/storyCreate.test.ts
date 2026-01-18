import { storiesList } from "@/cli/core/storiesList"
import { storyCreate } from "@/cli/core/storyCreate"
import { storyDelete } from "@/cli/core/storyDelete"
import { storyRead } from "@/cli/core/storyRead"
import { afterAll, beforeAll, beforeEach, expect, test } from "bun:test"
import { existsSync, rmSync } from "node:fs"
import { getTestConfig, assertOk, testBeforeAll, testAfterAll, resetTasksFile } from "../testHelpers"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const testDir = join(__dirname, "..")

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
const testStoriesPath = testConfig.storiesFolder

beforeAll(testBeforeAll)
afterAll(testAfterAll)
beforeEach(resetTasksFile)

beforeEach(() => {
	const files = ["S-001_test-001_test-story.md", "S-001_test-002_another-test.md"]
	for (const file of files) {
		const testFile = testStoriesPath + "/" + file
		if (existsSync(testFile)) {
			rmSync(testFile)
		}
	}
})

afterAll(() => {
	const files = ["S-001_test-001_test-story.md", "S-001_test-002_another-test.md"]
	for (const file of files) {
		const testFile = testStoriesPath + "/" + file
		if (existsSync(testFile)) {
			rmSync(testFile)
		}
	}
})

test("createStory creates new story file", async () => {
	const storiesBeforeResult = await storiesList(testConfig)
	expect(storiesBeforeResult.success).toBe(true)
	assertOk(storiesBeforeResult)
	const result = await storyCreate(testConfig, { shortStoryTitle: "test-story", projectDir: testDir, content: testStoryContent })
	expect(result.success).toBe(true)
	assertOk(result)
	const createdFilename = result.data.filePath.split("/").pop()
	expect(createdFilename).toBeDefined()
	const storiesAfterResult = await storiesList(testConfig)
	expect(storiesAfterResult.success).toBe(true)
	assertOk(storiesAfterResult)
	const storiesAfter = storiesAfterResult.data
	expect(storiesAfter.includes(createdFilename!)).toBe(true)

	const storyResult = await storyRead(testConfig, createdFilename!)
	expect(storyResult.success).toBe(true)
	assertOk(storyResult)
	const story = storyResult.data
	expect(story.title).toBe("Test Story")
	expect(story.description).toContain("test story")
})

test("createStory creates story with correct filename format", async () => {
	const result = await storyCreate(testConfig, { shortStoryTitle: "another-test", projectDir: testDir, content: testStoryContent })
	expect(result.success).toBe(true)
	assertOk(result)
	const filename = result.data.filePath.split("/").pop()
	expect(filename).toMatch(/S-\d{3}_test-\d{3}_another-test\.md/)
})
