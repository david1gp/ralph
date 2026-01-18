import { tasksRead } from "@/cli/core/tasksRead"
import { tasksWrite } from "@/cli/core/tasksWrite"
import { taskValidate } from "@/cli/data/taskValidate"
import type { Task } from "@/cli/data/TaskType"

export async function taskUpdate(id: string, updates: Partial<Task>): Promise<Task> {
	const tasks = await tasksRead()
	const index = tasks.findIndex((t) => t.id === id)
	if (index === -1) {
		throw new Error(`Task with id "${id}" not found`)
	}
	const updatedTask = taskValidate({ ...tasks[index], ...updates })
	tasks[index] = updatedTask
	await tasksWrite(tasks)
	return updatedTask
}
