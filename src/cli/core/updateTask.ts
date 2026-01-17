import { readTasks } from "@/cli/core/readTasks"
import { writeTasks } from "@/cli/core/writeTasks"
import { validateTask } from "@/cli/data/taskSchema"
import type { Task } from "@/cli/data/TaskType"

export function updateTask(id: string, updates: Partial<Task>): Task {
	const tasks = readTasks()
	const index = tasks.findIndex((t) => t.id === id)
	if (index === -1) {
		throw new Error(`Task with id "${id}" not found`)
	}
	const updatedTask = validateTask({ ...tasks[index], ...updates })
	tasks[index] = updatedTask
	writeTasks(tasks)
	return updatedTask
}
