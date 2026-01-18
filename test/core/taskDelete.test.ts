import { expect, test, beforeAll, afterAll, beforeEach } from "bun:test"
import { writeFileSync, readFileSync } from "node:fs"
import { taskDelete } from "@/cli/core/taskDelete"
import { tasksRead } from "@/cli/core/tasksRead"
import type { Result } from "~utils/result/Result"
import { testBeforeAll, testAfterAll, resetTasksFile, getTestConfig } from "../testHelpers"

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

const testConfig = getTestConfig()

beforeAll(() => {
	testBeforeAll()
})

afterAll(() => {
	testAfterAll()
})

beforeEach(() => {
	resetTasksFile()
})

test("taskDelete removes task by ID", async () => {
	const initialResult = await tasksRead(testConfig)
	expect(initialResult.success).toBe(true)
	assertOk(initialResult)
	const initialTasks = initialResult.data
	const initialCount = initialTasks.length
	const result = await taskDelete(testConfig, "T-004")
	expect(result.success).toBe(true)
	assertOk(result)
	expect(result.data).toBe(true)
	const tasksResult = await tasksRead(testConfig)
	expect(tasksResult.success).toBe(true)
	assertOk(tasksResult)
	const tasks = tasksResult.data
	expect(tasks.length).toBe(initialCount - 1)
	expect(tasks.find((t) => t.id === "T-004")).toBeUndefined()
})

test("taskDelete returns error for non-existent task", async () => {
	const result = await taskDelete(testConfig, "NON-EXISTENT")
	expect(result.success).toBe(false)
	assertErr(result)
	expect(result.errorMessage).toContain('Task with id "NON-EXISTENT" not found')
})
