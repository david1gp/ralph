import { tasksRead } from "@/cli/core/tasksRead"
import { tasksWrite } from "@/cli/core/tasksWrite"
import { taskValidate } from "@/cli/data/taskValidate"
import type { Task } from "@/cli/data/TaskType"

export function taskUpdate(id: string, updates: Partial<Task>): Task {
	const tasks = tasksRead()
	const index = tasks.findIndex((t) => t.id === id)
	if (index === -1) {
		throw new Error(`Task with id "${id}" not found`)
	}
	const updatedTask = taskValidate({ ...tasks[index], ...updates })
	tasks[index] = updatedTask
	tasksWrite(tasks)
	return updatedTask
}
