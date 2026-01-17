import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { getTasksFilePath } from "@/cli/core/getTasksFilePath"
import { parseTask } from "@/cli/data/parseTask"
import type { Task } from "@/cli/data/TaskType"

export function deleteTask(id: string): boolean {
	const tasks = readTasks()
	const index = tasks.findIndex((t) => t.id === id)
	if (index === -1) {
		return false
	}
	tasks.splice(index, 1)
	writeTasks(tasks)
	return true
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
