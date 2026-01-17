import { readTasks } from "@/cli/core/readTasks"
import type { Task } from "@/cli/data/TaskType"

export function findNextTask(): Task | undefined {
	const tasks = readTasks()
	return tasks.find((task) => task.passes === false)
}
