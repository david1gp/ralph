import { expect, test, beforeAll, afterAll, beforeEach } from "bun:test"
import { writeFileSync, readFileSync, rmSync, existsSync } from "node:fs"
import { storiesList } from "@/cli/core/storiesList"
import { storyRead } from "@/cli/core/storyRead"
import { storyCreate } from "@/cli/core/storyCreate"
import { storyDelete } from "@/cli/core/storyDelete"

const testStoriesPath = "/home/david/Coding/personal-taski-cli/stories"
const testStoryFilename = "test_story.md"
const testStoryContent = `# Story: Test Story

## Introduction

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

const existingStoryFilename = "taski_cli.md"

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

test("listStories returns all markdown filenames in stories folder", () => {
	const stories = storiesList()
	expect(Array.isArray(stories)).toBe(true)
	expect(stories.length).toBeGreaterThanOrEqual(1)
	expect(stories.includes(existingStoryFilename)).toBe(true)
})

test("readStory parses existing story correctly", () => {
	const story = storyRead(existingStoryFilename)
	expect(story.title).toBe("Taski CLI Tool")
	expect(story.introduction).toContain("CLI tool")
	expect(Array.isArray(story.goals)).toBe(true)
	expect(story.goals.length).toBeGreaterThan(0)
	expect(Array.isArray(story.userTasks)).toBe(true)
	expect(story.userTasks.includes("S-001")).toBe(true)
})

test("readStory throws error for non-existent story", () => {
	expect(() => storyRead("non_existent_story.md")).toThrow(
		'Story "non_existent_story.md" not found',
	)
})

test("createStory creates new story file", () => {
	const storiesBefore = storiesList()
	storyCreate(testStoryFilename, testStoryContent)
	const storiesAfter = storiesList()
	expect(storiesAfter.length).toBe(storiesBefore.length + 1)
	expect(storiesAfter.includes(testStoryFilename)).toBe(true)

	const story = storyRead(testStoryFilename)
	expect(story.title).toBe("Test Story")
	expect(story.introduction).toContain("test story")
})

test("createStory appends .md extension if missing", () => {
	const filenameWithoutExt = "another_test"
	storyCreate(filenameWithoutExt, testStoryContent)
	const stories = storiesList()
	expect(stories.includes(`${filenameWithoutExt}.md`)).toBe(true)
	storyDelete(`${filenameWithoutExt}.md`)
})

test("deleteStory removes story file", () => {
	storyCreate(testStoryFilename, testStoryContent)
	const storiesBefore = storiesList()
	const result = storyDelete(testStoryFilename)
	expect(result).toBe(true)
	const storiesAfter = storiesList()
	expect(storiesAfter.length).toBe(storiesBefore.length - 1)
	expect(storiesAfter.includes(testStoryFilename)).toBe(false)
})

test("deleteStory returns false for non-existent story", () => {
	const result = storyDelete("non_existent_story.md")
	expect(result).toBe(false)
})

test("readStory parses goals correctly", () => {
	const story = storyRead(existingStoryFilename)
	expect(story.goals).toContain("Create a fully functional CLI tool for task/story management")
	expect(story.goals).toContain("Implement type-safe schemas with valibot validation")
})

test("readStory parses userTasks correctly", () => {
	const story = storyRead(existingStoryFilename)
	expect(story.userTasks).toContain("S-001")
	expect(story.userTasks).toContain("S-002")
	expect(story.userTasks).toContain("S-003")
})
