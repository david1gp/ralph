import { expect, test, afterAll, beforeAll, beforeEach } from "bun:test"
import { rmSync, existsSync } from "node:fs"
import { storiesList } from "@/cli/core/storiesList"
import { storyCreate } from "@/cli/core/storyCreate"
import { storyDelete } from "@/cli/core/storyDelete"
import { getTestConfig, assertOk, assertErr, testBeforeAll, testAfterAll, resetTasksFile } from "../testHelpers"
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

afterAll(() => {
	const testFile = testStoriesPath + "/S-001_test-001_delete-test-story.md"
	if (existsSync(testFile)) {
		rmSync(testFile)
	}
})

beforeEach(() => {
	const testFile = testStoriesPath + "/S-001_test-001_delete-test-story.md"
	if (existsSync(testFile)) {
		rmSync(testFile)
	}
})

test("deleteStory removes story file", async () => {
	const createResult = await storyCreate(testConfig, { shortStoryTitle: "delete-test-story", projectDir: testDir, content: testStoryContent })
	expect(createResult.success).toBe(true)
	assertOk(createResult)
	const createdFilename = createResult.data.filePath.split("/").pop()
	expect(createdFilename).toBeDefined()
	
	const storiesBeforeResult = await storiesList(testConfig)
	expect(storiesBeforeResult.success).toBe(true)
	assertOk(storiesBeforeResult)
	
	const result = await storyDelete(testConfig, createdFilename!)
	expect(result.success).toBe(true)
	assertOk(result)
	expect(result.data).toBe(true)
	
	const storiesAfterResult = await storiesList(testConfig)
	expect(storiesAfterResult.success).toBe(true)
	assertOk(storiesAfterResult)
	const storiesAfter = storiesAfterResult.data
	expect(storiesAfter.includes(createdFilename!)).toBe(false)
})

test("deleteStory returns error for non-existent story", async () => {
	const result = await storyDelete(testConfig, "non_existent_story.md")
	expect(result.success).toBe(false)
	assertErr(result)
	expect(result.errorMessage).toContain('Story "non_existent_story.md" not found')
})
