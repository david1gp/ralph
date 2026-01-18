import { expect, test, beforeAll, afterAll, beforeEach } from "bun:test"
import { writeFileSync, readFileSync, existsSync } from "node:fs"
import { taskFindNext } from "@/cli/core/taskFindNext"
import { tasksRead } from "@/cli/core/tasksRead"
import { taskUpdate } from "@/cli/core/taskUpdate"
import type { Result } from "~utils/result/Result"

function assertOk<T>(result: Result<T>): asserts result is Extract<typeof result, { success: true }> {
	if (!result.success) {
		throw new Error(`Expected success but got error: ${result.errorMessage}`)
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

test("taskFindNext returns first task with passes=false", async () => {
	const result = await taskFindNext()
	expect(result.success).toBe(true)
	assertOk(result)
	const next = result.data
	expect(next).not.toBeUndefined()
	expect(next!.passes).toBe(false)
	expect(next!.id).toBe("T-007")
})

test("taskFindNext returns undefined when all tasks pass", async () => {
	const tasksResult = await tasksRead()
	expect(tasksResult.success).toBe(true)
	assertOk(tasksResult)
	const tasks = tasksResult.data
	for (const task of tasks) {
		await taskUpdate(task.id, { passes: true })
	}
	const result = await taskFindNext()
	expect(result.success).toBe(true)
	assertOk(result)
	expect(result.data).toBeUndefined()
})
