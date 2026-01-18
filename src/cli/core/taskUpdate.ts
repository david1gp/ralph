import { tasksRead } from "@/cli/core/tasksRead"
import { tasksWrite } from "@/cli/core/tasksWrite"
import { taskValidate } from "@/cli/data/taskValidate"
import type { Task } from "@/cli/data/TaskType"
import { createResult, createError, type PromiseResult } from "~utils/result/Result"

export async function taskUpdate(id: string, updates: Partial<Task>): PromiseResult<Task> {
	const tasksResult = await tasksRead()
	if (!tasksResult.success) {
		return tasksResult
	}
	const tasks = tasksResult.data
	const index = tasks.findIndex((t) => t.id === id)
	if (index === -1) {
		return createError("taskUpdate", `Task with id "${id}" not found`)
	}
	const updatedTask = taskValidate({ ...tasks[index], ...updates })
	tasks[index] = updatedTask
	const writeResult = await tasksWrite(tasks)
	if (!writeResult.success) {
		return writeResult
	}
	return createResult(updatedTask)
}
