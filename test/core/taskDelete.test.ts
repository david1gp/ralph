import { expect, test, beforeAll, afterAll, beforeEach } from "bun:test"
import { writeFileSync, readFileSync, existsSync } from "node:fs"
import { taskDelete } from "@/cli/core/taskDelete"
import { tasksRead } from "@/cli/core/tasksRead"
import type { Result } from "~utils/result/Result"

function assertOk<T>(result: Result<T>): asserts result is Extract<typeof result, { success: true }> {
	if (!result.success) {
		throw new Error(`Expected success but got error: ${result.errorMessage}`)
	}
}

function assertErr<T>(result: Result<T>): asserts result is Extract<typeof result, { success: false }> {
	if (result.success) {
		throw new Error(`Expected error but got success`)
	}
}

const originalTasksPath = "/home/david/Coding/personal-taski-cli/.taski/tasks.json"
const originalContent: string = readFileSync(originalTasksPath, "utf-8")

beforeAll(() => {
	if (!existsSync("/home/david/Coding/personal-taski-cli/.taski")) {
		throw new Error(".taski directory does not exist")
	}
})

afterAll(() => {
	writeFileSync(originalTasksPath, originalContent)
})

beforeEach(() => {
	writeFileSync(originalTasksPath, originalContent)
})

test("taskDelete removes task by ID", async () => {
	const initialResult = await tasksRead()
	expect(initialResult.success).toBe(true)
	assertOk(initialResult)
	const initialTasks = initialResult.data
	const initialCount = initialTasks.length
	const result = await taskDelete("T-004")
	expect(result.success).toBe(true)
	assertOk(result)
	expect(result.data).toBe(true)
	const tasksResult = await tasksRead()
	expect(tasksResult.success).toBe(true)
	assertOk(tasksResult)
	const tasks = tasksResult.data
	expect(tasks.length).toBe(initialCount - 1)
	expect(tasks.find((t) => t.id === "T-004")).toBeUndefined()
})

test("taskDelete returns error for non-existent task", async () => {
	const result = await taskDelete("NON-EXISTENT")
	expect(result.success).toBe(false)
	assertErr(result)
	expect(result.errorMessage).toContain('Task with id "NON-EXISTENT" not found')
})
