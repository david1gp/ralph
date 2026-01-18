import { tasksRead } from "@/cli/core/tasksRead"
import { tasksWrite } from "@/cli/core/tasksWrite"
import { createResult, createError, type PromiseResult } from "~utils/result/Result"

export async function taskDelete(id: string): PromiseResult<boolean> {
	const tasksResult = await tasksRead()
	if (!tasksResult.success) {
		return tasksResult
	}
	const tasks = tasksResult.data
	const index = tasks.findIndex((t) => t.id === id)
	if (index === -1) {
		return createError("taskDelete", `Task with id "${id}" not found`)
	}
	tasks.splice(index, 1)
	const writeResult = await tasksWrite(tasks)
	if (!writeResult.success) {
		return writeResult
	}
	return createResult(true)
}
