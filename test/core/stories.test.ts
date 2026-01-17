import { expect, test, beforeAll, afterAll, beforeEach } from "bun:test"
import { writeFileSync, readFileSync, rmSync, existsSync } from "node:fs"
import { listStories } from "@/cli/core/listStories"
import { readStory } from "@/cli/core/readStory"
import { createStory } from "@/cli/core/createStory"
import { deleteStory } from "@/cli/core/deleteStory"

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
	const stories = listStories()
	expect(Array.isArray(stories)).toBe(true)
	expect(stories.length).toBeGreaterThanOrEqual(1)
	expect(stories.includes(existingStoryFilename)).toBe(true)
})

test("readStory parses existing story correctly", () => {
	const story = readStory(existingStoryFilename)
	expect(story.title).toBe("Taski CLI Tool")
	expect(story.introduction).toContain("CLI tool")
	expect(Array.isArray(story.goals)).toBe(true)
	expect(story.goals.length).toBeGreaterThan(0)
	expect(Array.isArray(story.userTasks)).toBe(true)
	expect(story.userTasks.includes("S-001")).toBe(true)
})

test("readStory throws error for non-existent story", () => {
	expect(() => readStory("non_existent_story.md")).toThrow(
		'Story "non_existent_story.md" not found',
	)
})

test("createStory creates new story file", () => {
	const storiesBefore = listStories()
	createStory(testStoryFilename, testStoryContent)
	const storiesAfter = listStories()
	expect(storiesAfter.length).toBe(storiesBefore.length + 1)
	expect(storiesAfter.includes(testStoryFilename)).toBe(true)

	const story = readStory(testStoryFilename)
	expect(story.title).toBe("Test Story")
	expect(story.introduction).toContain("test story")
})

test("createStory appends .md extension if missing", () => {
	const filenameWithoutExt = "another_test"
	createStory(filenameWithoutExt, testStoryContent)
	const stories = listStories()
	expect(stories.includes(`${filenameWithoutExt}.md`)).toBe(true)
	deleteStory(`${filenameWithoutExt}.md`)
})

test("deleteStory removes story file", () => {
	createStory(testStoryFilename, testStoryContent)
	const storiesBefore = listStories()
	const result = deleteStory(testStoryFilename)
	expect(result).toBe(true)
	const storiesAfter = listStories()
	expect(storiesAfter.length).toBe(storiesBefore.length - 1)
	expect(storiesAfter.includes(testStoryFilename)).toBe(false)
})

test("deleteStory returns false for non-existent story", () => {
	const result = deleteStory("non_existent_story.md")
	expect(result).toBe(false)
})

test("readStory parses goals correctly", () => {
	const story = readStory(existingStoryFilename)
	expect(story.goals).toContain("Create a fully functional CLI tool for task/story management")
	expect(story.goals).toContain("Implement type-safe schemas with valibot validation")
})

test("readStory parses userTasks correctly", () => {
	const story = readStory(existingStoryFilename)
	expect(story.userTasks).toContain("S-001")
	expect(story.userTasks).toContain("S-002")
	expect(story.userTasks).toContain("S-003")
})
