import { taskFilePathGet } from "@/cli/core/taskFilePathGet"
import { writeFileSync } from "node:fs"

export function tasksWrite(tasks: unknown[]): void {
	const tasksPath = taskFilePathGet()
	writeFileSync(tasksPath, JSON.stringify(tasks, null, 2))
}
