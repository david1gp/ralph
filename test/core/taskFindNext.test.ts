import { expect, test, beforeAll, afterAll, beforeEach } from "bun:test"
import { taskFindNext } from "@/cli/core/taskFindNext"
import { tasksRead } from "@/cli/core/tasksRead"
import { taskUpdate } from "@/cli/core/taskUpdate"
import type { ConfigType } from "@/cli/data/ConfigType"
import type { Result } from "~utils/result/Result"
import { testBeforeAll, testAfterAll, resetTasksFile, getTestConfig } from "../testHelpers"

function assertOk<T>(result: Result<T>): asserts result is Extract<typeof result, { success: true }> {
	if (!result.success) {
		throw new Error(`Expected success but got error: ${result.errorMessage}`)
	}
}

beforeAll(testBeforeAll)
afterAll(testAfterAll)
beforeEach(resetTasksFile)

const testConfig: ConfigType = getTestConfig()

test("taskFindNext returns first task with passes=false", async () => {
	const result = await taskFindNext(testConfig)
	expect(result.success).toBe(true)
	assertOk(result)
	const next = result.data
	expect(next).not.toBeUndefined()
	expect(next!.passes).toBe(false)
	expect(next!.id).toBe("T-001")
})

test("taskFindNext returns undefined when all tasks pass", async () => {
	const tasksResult = await tasksRead(testConfig)
	expect(tasksResult.success).toBe(true)
	assertOk(tasksResult)
	const tasks = tasksResult.data
	for (const task of tasks) {
		await taskUpdate(testConfig, task.id, { passes: true })
	}
	const result = await taskFindNext(testConfig)
	expect(result.success).toBe(true)
	assertOk(result)
	expect(result.data).toBeUndefined()
})
