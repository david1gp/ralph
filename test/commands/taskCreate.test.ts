import { expect, test, beforeAll, afterAll, beforeEach, mock } from "bun:test"
import { writeFileSync, readFileSync, rmSync } from "node:fs"
import { taskCreateFunc, taskCreateCommand } from "@/cli/cmd/tasks/taskCreateCommand"
import { tasksRead } from "@/cli/core/tasksRead"
import type { Result } from "~utils/result/Result"

function assertOk<T>(result: Result<T>): asserts result is Extract<typeof result, { success: true }> {
	if (!result.success) {
		throw new Error(`Expected success but got error: ${result.errorMessage}`)
	}
}

const originalTasksPath = "/home/david/Coding/personal-taski-cli/.taski/tasks.json"
const originalContent: string = readFileSync(originalTasksPath, "utf-8")

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

beforeAll(() => {
	stdout = []
})

afterAll(() => {
	writeFileSync(originalTasksPath, originalContent)
})

beforeEach(() => {
	stdout = []
	writeFileSync(originalTasksPath, originalContent)
})

test("taskCreateCommand creates task with required --title flag", async () => {
	const context = createMockContext()
	const params = { title: "New Task", description: "Test description", acceptanceCriteria: "[]", story: "test-story", dir: "/home/david/Coding/test" }
	await taskCreateFunc.call(context, params)
	
	expect(stdout[0]).toMatch(/^T-\d{3}$/)
	const tasksResult = await tasksRead()
	expect(tasksResult.success).toBe(true)
	assertOk(tasksResult)
	const tasks = tasksResult.data
	const created = tasks.find(t => t.title === "New Task")
	expect(created).toBeDefined()
	expect(created!.title).toBe("New Task")
	expect(created!.description).toBe("Test description")
	expect(created!.acceptanceCriteria).toEqual([])
	expect(created!.passes).toBe(false)
	expect(created!.note).toBe("")
})

test("taskCreateCommand creates task with all optional flags", async () => {
	const context = createMockContext()
	const params = {
		title: "Full Task",
		description: "Task description",
		acceptanceCriteria: '["Test 1", "Test 2"]',
		priority: 50,
		passes: true,
		start: "now",
		note: "Test note",
		story: "full-task-story",
		dir: "/home/david/Coding/test",
	}
	await taskCreateFunc.call(context, params)
	
	expect(stdout[0]).toMatch(/^T-\d{3}$/)
	const tasksResult = await tasksRead()
	expect(tasksResult.success).toBe(true)
	assertOk(tasksResult)
	const tasks = tasksResult.data
	const created = tasks.find(t => t.title === "Full Task")
	expect(created).toBeDefined()
	expect(created!.title).toBe("Full Task")
	expect(created!.description).toBe("Task description")
	expect(created!.acceptanceCriteria).toEqual(["Test 1", "Test 2"])
	expect(created!.priority).toBe(50)
	expect(created!.passes).toBe(true)
	expect(created!.note).toBe("Test note")
	expect(created!.startedAt).toBeDefined()
	expect(created!.endedAt).toBeUndefined()
})

test("taskCreateCommand auto-generates ID", async () => {
	const context = createMockContext()
	const params = { title: "Auto ID Task", description: "Test", acceptanceCriteria: "[]", story: "auto-id", dir: "/home/david/Coding/test" }
	await taskCreateFunc.call(context, params)
	
	const tasksResult = await tasksRead()
	expect(tasksResult.success).toBe(true)
	assertOk(tasksResult)
	const tasks = tasksResult.data
	const created = tasks.find(t => t.title === "Auto ID Task")
	expect(created).toBeDefined()
	expect(created!.id).toMatch(/^T-\d{3}$/)
})

test("taskCreateCommand calculates priority as max + 1 when not provided", async () => {
	const tasksResult = await tasksRead()
	expect(tasksResult.success).toBe(true)
	assertOk(tasksResult)
	const tasks = tasksResult.data
	const maxPriority = Math.max(...tasks.map(t => t.priority))
	
	const context = createMockContext()
	const params = { title: "Default Priority Task", description: "Test", acceptanceCriteria: "[]", story: "default-priority", dir: "/home/david/Coding/test" }
	await taskCreateFunc.call(context, params)
	
	const createdResult = await tasksRead()
	expect(createdResult.success).toBe(true)
	assertOk(createdResult)
	const created = createdResult.data.find(t => t.title === "Default Priority Task")
	expect(created).toBeDefined()
	expect(created!.priority).toBe(maxPriority + 1)
})

test("taskCreateCommand uses provided priority", async () => {
	const context = createMockContext()
	const params = { title: "Custom Priority Task", priority: 999, description: "Test", acceptanceCriteria: "[]", story: "custom-priority", dir: "/home/david/Coding/test" }
	await taskCreateFunc.call(context, params)
	
	const createdResult = await tasksRead()
	expect(createdResult.success).toBe(true)
	assertOk(createdResult)
	const created = createdResult.data.find(t => t.title === "Custom Priority Task")
	expect(created).toBeDefined()
	expect(created!.priority).toBe(999)
})

test("taskCreateCommand parses acceptance criteria as JSON array", async () => {
	const context = createMockContext()
	const params = { title: "AC Task", acceptanceCriteria: '["Criterion 1", "Criterion 2", "Criterion 3"]', description: "Test", story: "ac-task", dir: "/home/david/Coding/test" }
	await taskCreateFunc.call(context, params)
	
	const createdResult = await tasksRead()
	expect(createdResult.success).toBe(true)
	assertOk(createdResult)
	const created = createdResult.data.find(t => t.title === "AC Task")
	expect(created).toBeDefined()
	expect(created!.acceptanceCriteria).toEqual(["Criterion 1", "Criterion 2", "Criterion 3"])
})

test("taskCreateCommand throws error for invalid acceptance criteria format", async () => {
	const context = createMockContext()
	const params = { title: "Invalid AC Task", acceptanceCriteria: "not-json", description: "Test", story: "invalid-ac", dir: "/home/david/Coding/test" }
	
	expect(taskCreateFunc.call(context, params)).rejects.toThrow("JSON Parse error")
})

test("taskCreateCommand parses 'now' as current timestamp for start", async () => {
	const context = createMockContext()
	const params = { title: "Start Now Task", start: "now", description: "Test", acceptanceCriteria: "[]", story: "start-now", dir: "/home/david/Coding/test" }
	await taskCreateFunc.call(context, params)
	
	const createdResult = await tasksRead()
	expect(createdResult.success).toBe(true)
	assertOk(createdResult)
	const created = createdResult.data.find(t => t.title === "Start Now Task")
	expect(created).toBeDefined()
	expect(created!.startedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
})

test("taskCreateCommand parses ISO 8601 timestamp for start", async () => {
	const context = createMockContext()
	const params = { title: "Start ISO Task", start: "2025-01-17T10:00:00.000Z", description: "Test", acceptanceCriteria: "[]", story: "start-iso", dir: "/home/david/Coding/test" }
	await taskCreateFunc.call(context, params)
	
	const createdResult = await tasksRead()
	expect(createdResult.success).toBe(true)
	assertOk(createdResult)
	const created = createdResult.data.find(t => t.title === "Start ISO Task")
	expect(created).toBeDefined()
	expect(created!.startedAt).toBe("2025-01-17T10:00:00.000Z")
})

test("taskCreateCommand handles empty start to clear", async () => {
	const context = createMockContext()
	const params = { title: "Empty Start Task", start: "", description: "Test", acceptanceCriteria: "[]", story: "empty-start", dir: "/home/david/Coding/test" }
	await taskCreateFunc.call(context, params)
	
	const createdResult = await tasksRead()
	expect(createdResult.success).toBe(true)
	assertOk(createdResult)
	const created = createdResult.data.find(t => t.title === "Empty Start Task")
	expect(created).toBeDefined()
	expect(created!.startedAt).toBeUndefined()
})

test("taskCreateCommand parses end timestamp", async () => {
	const context = createMockContext()
	const params = { title: "End Task", end: "2025-01-17T18:00:00.000Z", description: "Test", acceptanceCriteria: "[]", story: "end-task", dir: "/home/david/Coding/test" }
	await taskCreateFunc.call(context, params)
	
	const createdResult = await tasksRead()
	expect(createdResult.success).toBe(true)
	assertOk(createdResult)
	const created = createdResult.data.find(t => t.title === "End Task")
	expect(created).toBeDefined()
	expect(created!.endedAt).toBe("2025-01-17T18:00:00.000Z")
})

test("taskCreateCommand handles empty end to clear", async () => {
	const context = createMockContext()
	const params = { title: "Empty End Task", end: "", description: "Test", acceptanceCriteria: "[]", story: "empty-end", dir: "/home/david/Coding/test" }
	await taskCreateFunc.call(context, params)
	
	const createdResult = await tasksRead()
	expect(createdResult.success).toBe(true)
	assertOk(createdResult)
	const created = createdResult.data.find(t => t.title === "Empty End Task")
	expect(created).toBeDefined()
	expect(created!.endedAt).toBeUndefined()
})

test("taskCreateCommand sets dir to specified value", async () => {
	const context = createMockContext()
	const params = { title: "Dir Test Task", description: "Test", acceptanceCriteria: "[]", story: "dir-test", dir: "/custom/path" }
	await taskCreateFunc.call(context, params)
	
	const createdResult = await tasksRead()
	expect(createdResult.success).toBe(true)
	assertOk(createdResult)
	const created = createdResult.data.find(t => t.title === "Dir Test Task")
	expect(created).toBeDefined()
	expect(created!.dir).toBe("/custom/path")
})
