import { tasksRead } from "@/cli/core/tasksRead"
import type { Task } from "@/cli/data/TaskType"

export async function taskFindNext(): Promise<Task | undefined> {
	const tasks = await tasksRead()
	return tasks.find((task) => task.passes === false)
}
