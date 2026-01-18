import { expect, test, beforeAll, afterAll, beforeEach } from "bun:test"
import { tasksRead } from "@/cli/core/tasksRead"
import { rmSync } from "node:fs"
import type { Result } from "~utils/result/Result"
import { testBeforeAll, testAfterAll, resetTasksFile, getTestConfig } from "../testHelpers"

function assertOk<T>(result: Result<T>): asserts result is Extract<typeof result, { success: true }> {
	if (!result.success) {
		throw new Error(`Expected success but got error: ${result.errorMessage}`)
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

test("tasksRead returns all tasks from tasks.json", async () => {
	const result = await tasksRead(testConfig)
	expect(result.success).toBe(true)
	assertOk(result)
	const tasks = result.data
	expect(tasks.length).toBe(10)
	expect(tasks[0]!.id).toBe("T-001")
	expect(tasks[1]!.id).toBe("T-002")
	expect(tasks[3]!.id).toBe("T-004")
})

test("tasksRead returns empty array when file does not exist", async () => {
	rmSync(testConfig.tasksFile, { force: true })
	const result = await tasksRead(testConfig)
	expect(result.success).toBe(true)
	assertOk(result)
	expect(result.data).toEqual([])
	resetTasksFile()
})
