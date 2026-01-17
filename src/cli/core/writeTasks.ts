import { writeFileSync } from "node:fs"
import { getTasksFilePath } from "@/cli/core/getTasksFilePath"

export function writeTasks(tasks: unknown[]): void {
	const tasksPath = getTasksFilePath()
	writeFileSync(tasksPath, JSON.stringify(tasks, null, 2))
}
