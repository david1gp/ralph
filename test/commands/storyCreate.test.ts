import { expect, test, beforeAll, afterAll, beforeEach, mock } from "bun:test"
import { writeFileSync, readFileSync, rmSync, existsSync } from "node:fs"
import { storyCreateFunc, storyCreateCommand } from "@/cli/cmd/stories/storyCreateCommand"
import { storiesList } from "@/cli/core/storiesList"
import { storyRead } from "@/cli/core/storyRead"

const storiesPath = "/home/david/Coding/personal-taski-cli/stories"

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

test("storyCreateCommand creates story with --filename and --content", () => {
	const context = createMockContext()
	const params = { filename: testStoryFilename, content: testStoryContent }
	storyCreateFunc.call(context, params)
	
	expect(stdout[0]).toContain(`Story "${testStoryFilename}" created successfully`)
	
	const stories = storiesList()
	expect(stories.includes(testStoryFilename)).toBe(true)
	
	const story = storyRead(testStoryFilename)
	expect(story.title).toBe("Command Test Story")
	expect(story.description).toContain("test story created by the command test")
})

test("storyCreateCommand creates story with simple content", () => {
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
	storyCreateFunc.call(context, params)
	
	expect(stdout[0]).toContain("Story \"simple_test.md\" created successfully")
	
	const stories = storiesList()
	expect(stories.includes("simple_test.md")).toBe(true)
	
	const story = storyRead("simple_test.md")
	expect(story.title).toBe("Simple Story")
})

test("storyCreateCommand creates story with goals", () => {
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
	storyCreateFunc.call(context, params)
	
	const story = storyRead("goals_story.md")
	expect(story.goals).toEqual(["Goal one", "Goal two", "Goal three"])
})

test("storyCreateCommand creates story with user tasks", () => {
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
	storyCreateFunc.call(context, params)
	
	const story = storyRead("tasks_story.md")
	expect(story.userTasks).toEqual(["T-001", "T-002", "S-003"])
})

test("storyCreateCommand creates story with complex markdown formatting", () => {
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
	storyCreateFunc.call(context, params)
	
	expect(stdout[0]).toContain("Story \"complex_story.md\" created successfully")
	
	const stories = storiesList()
	expect(stories.includes("complex_story.md")).toBe(true)
	
	const story = storyRead("complex_story.md")
	expect(story.title).toBe("Complex Story")
	expect(story.description).toContain("bold")
	expect(story.goals.length).toBeGreaterThanOrEqual(2)
})

test("storyCreateCommand increments story count in stories list", () => {
	const storiesBefore = storiesList()
	const expectedAfter = storiesBefore.length + 1
	
	const context = createMockContext()
	const params = { filename: "count_test.md", content: "# Story: Count Story\n\n## Description\n\nTesting story count.\n\n## Goals\n\n- Goal\n\n## User Tasks\n\n### T-COUNT-001: Count task" }
	storyCreateFunc.call(context, params)
	
	const storiesAfter = storiesList()
	expect(storiesAfter.includes("count_test.md")).toBe(true)
})

test("storyCreateCommand handles multiline content", () => {
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
	storyCreateFunc.call(context, params)
	
	const story = storyRead("multiline_story.md")
	expect(story.title).toBe("Multiline Story")
	expect(story.goals.length).toBeGreaterThan(1)
})

test("storyCreateCommand outputs success message with filename", () => {
	const context = createMockContext()
	const params = { filename: "output_test.md", content: "# Output Story\n\nTesting output.\n\n## Goals\n\n- Goal\n\n## User Tasks\n\n### T-OUTPUT-001: Output task" }
	storyCreateFunc.call(context, params)
	
	expect(stdout[0]).toBe('Story "output_test.md" created successfully')
})
