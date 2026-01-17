import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { getTasksFilePath } from "@/cli/core/getTasksFilePath"
import { parseTask } from "@/cli/data/parseTask"
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

export function readTasks(): Task[] {
	const tasksPath = getTasksFilePath()
	if (!existsSync(tasksPath)) {
		return []
	}
	const content = readFileSync(tasksPath, "utf-8")
	const parsed = JSON.parse(content)
	if (!Array.isArray(parsed)) {
		throw new Error("tasks.json must contain an array")
	}
	return parsed.map((task, index) => {
		const result = parseTask(task)
		if (!result.success) {
			throw new Error(`Invalid task at index ${index}: ${result.issues}`)
		}
		return result.data
	})
}

function writeTasks(tasks: Task[]): void {
	const tasksPath = getTasksFilePath()
	writeFileSync(tasksPath, JSON.stringify(tasks, null, 2))
}
