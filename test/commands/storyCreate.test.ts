import { expect, test, beforeAll, afterAll, beforeEach, mock } from "bun:test"
import { writeFileSync, readFileSync, rmSync, existsSync } from "node:fs"
import { storyCreateFunc, storyCreateCommand } from "@/cli/cmd/stories/storyCreateCommand"
import { storiesList } from "@/cli/core/storiesList"
import { storyRead } from "@/cli/core/storyRead"

const storiesPath = "/home/david/Coding/personal-taski-cli/.taski/stories"

let stdout: string[] = []

const mockProcess = {
	stdout: {
		write: mock((text: string) => {
			stdout.push(text)
		}),
	},
}

function createMockContext() {
	return {
		process: mockProcess,
	} as any
}

const testStoryFilename = "command_test_story.md"
const testStoryContent = `# Story: Command Test Story

## Description

This is a test story created by the command test.

## Goals

- Test story create command
- Verify file is created correctly
- Check content parsing

## User Tasks

### T-CMD-001: Test task
`

beforeAll(() => {
	stdout = []
})

afterAll(() => {
	const testFile = `${storiesPath}/${testStoryFilename}`
	if (existsSync(testFile)) {
		rmSync(testFile)
	}
})

beforeEach(() => {
	stdout = []
	const testFile = `${storiesPath}/${testStoryFilename}`
	if (existsSync(testFile)) {
		rmSync(testFile)
	}
})

test("storyCreateCommand creates story with --filename and --content", async () => {
	const context = createMockContext()
	const params = { filename: testStoryFilename, content: testStoryContent }
	await storyCreateFunc.call(context, params)
	
	expect(stdout[0]).toBe(`${storiesPath}/${testStoryFilename}`)
	
	const stories = await storiesList()
	expect(stories.includes(testStoryFilename)).toBe(true)
	
	const story = await storyRead(testStoryFilename)
	expect(story.title).toBe("Command Test Story")
	expect(story.description).toContain("test story created by the command test")
})

test("storyCreateCommand creates story with simple content", async () => {
	const simpleContent = `# Story: Simple Story

## Description

A simple story content.

## Goals

- Simple goal

## User Tasks

### T-SIMPLE-001: Simple task
`
	const context = createMockContext()
	const params = { filename: "simple_test.md", content: simpleContent }
	await storyCreateFunc.call(context, params)
	
	expect(stdout[0]).toBe(`${storiesPath}/simple_test.md`)
	
	const stories = await storiesList()
	expect(stories.includes("simple_test.md")).toBe(true)
	
	const story = await storyRead("simple_test.md")
	expect(story.title).toBe("Simple Story")
})

test("storyCreateCommand creates story with goals", async () => {
	const contentWithGoals = `# Story: Goals Story

## Description

A story with goals.

## Goals

- Goal one
- Goal two
- Goal three

## User Tasks

### T-GOALS-001: Goals task
`
	const context = createMockContext()
	const params = { filename: "goals_story.md", content: contentWithGoals }
	await storyCreateFunc.call(context, params)
	
	const story = await storyRead("goals_story.md")
	expect(story.goals).toEqual(["Goal one", "Goal two", "Goal three"])
})

test("storyCreateCommand creates story with user tasks", async () => {
	const contentWithTasks = `# Story: Tasks Story

## Description

A story with user tasks.

## User Tasks

### T-001: First task
### T-002: Second task
### S-003: Story task

## Goals

- Task goal
`
	const context = createMockContext()
	const params = { filename: "tasks_story.md", content: contentWithTasks }
	await storyCreateFunc.call(context, params)
	
	const story = await storyRead("tasks_story.md")
	expect(story.userTasks).toEqual(["T-001", "T-002", "S-003"])
})

test("storyCreateCommand creates story with complex markdown formatting", async () => {
	const complexContent = `# Story: Complex Story

## Description

This story has **bold** and *italic* text, as well as [links](https://example.com).

## Goals

- Complex goal with \`code\`
- Another goal
  - Nested item
  - Another nested item

## User Tasks

### T-COMPLEX-001: Complex task
### T-COMPLEX-002: Another complex task
`
	const context = createMockContext()
	const params = { filename: "complex_story.md", content: complexContent }
	await storyCreateFunc.call(context, params)
	
	expect(stdout[0]).toBe(`${storiesPath}/complex_story.md`)
	
	const stories = await storiesList()
	expect(stories.includes("complex_story.md")).toBe(true)
	
	const story = await storyRead("complex_story.md")
	expect(story.title).toBe("Complex Story")
	expect(story.description).toContain("bold")
	expect(story.goals.length).toBeGreaterThanOrEqual(2)
})

test("storyCreateCommand creates story with multiline content", async () => {
	const multilineContent = `# Story: Multiline Story

## Description

This story has:
- Multiple bullet points
- More bullet points
- Even more bullet points

## Goals

- First goal
  - Sub goal 1
  - Sub goal 2
- Second goal

## User Tasks

### T-MULTI-001: Multiline task
`
	const context = createMockContext()
	const params = { filename: "multiline_story.md", content: multilineContent }
	await storyCreateFunc.call(context, params)
	
	const story = await storyRead("multiline_story.md")
	expect(story.title).toBe("Multiline Story")
	expect(story.goals.length).toBeGreaterThan(1)
})

test("storyCreateCommand outputs success message with filename", async () => {
	const context = createMockContext()
	const params = { filename: "output_test.md", content: "# Output Story\n\nTesting output.\n\n## Goals\n\n- Goal\n\n## User Tasks\n\n### T-OUTPUT-001: Output task" }
	await storyCreateFunc.call(context, params)
	
	expect(stdout[0]).toBe(`${storiesPath}/output_test.md`)
})
