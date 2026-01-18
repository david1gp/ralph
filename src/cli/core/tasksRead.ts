import { taskFilePathGet } from "@/cli/core/taskFilePathGet"
import { taskParse } from "@/cli/data/taskParse"
import type { Task } from "@/cli/data/TaskType"
import { existsSync, readFileSync } from "node:fs"

export async function tasksRead(): Promise<Task[]> {
	const tasksPath = await taskFilePathGet()
	if (!existsSync(tasksPath)) {
		return []
	}
	const content = readFileSync(tasksPath, "utf-8")
	const parsed = JSON.parse(content)
	if (!Array.isArray(parsed)) {
		throw new Error("tasks.json must contain an array")
	}
	return parsed.map((task, index) => {
		const result = taskParse(task)
		if (!result.success) {
			throw new Error(`Invalid task at index ${index}: ${result.issues}`)
		}
		return result.data
	})
}
