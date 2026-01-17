import { readFileSync, existsSync } from "node:fs"
import { getTasksFilePath } from "@/cli/core/getTasksFilePath"
import { parseTask } from "@/cli/data/parseTask"
import type { Task } from "@/cli/data/TaskType"

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
