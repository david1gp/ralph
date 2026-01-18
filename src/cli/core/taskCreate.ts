import { tasksRead } from "@/cli/core/tasksRead"
import { tasksWrite } from "@/cli/core/tasksWrite"
import { taskValidate } from "@/cli/data/taskValidate"
import type { Task } from "@/cli/data/TaskType"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function taskCreate(task: Task): PromiseResult<Task> {
	const tasksResult = await tasksRead()
	if (!tasksResult.success) {
		return tasksResult
	}
	const tasks = tasksResult.data
	const newTask = taskValidate(task)
	tasks.push(newTask)
	const writeResult = await tasksWrite(tasks)
	if (!writeResult.success) {
		return writeResult
	}
	return createResult(newTask)
}
