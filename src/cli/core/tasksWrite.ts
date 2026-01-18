import { taskFilePathGet } from "@/cli/core/taskFilePathGet"
import { writeFileSync } from "node:fs"

export async function tasksWrite(tasks: unknown[]): Promise<void> {
	const tasksPath = await taskFilePathGet()
	writeFileSync(tasksPath, JSON.stringify(tasks, null, 2))
}
