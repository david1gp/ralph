import { readTasks } from "@/cli/core/readTasks"
import { writeTasks } from "@/cli/core/writeTasks"

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
