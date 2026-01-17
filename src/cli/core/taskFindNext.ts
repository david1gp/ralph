import { tasksRead } from "@/cli/core/tasksRead"
import type { Task } from "@/cli/data/TaskType"

export function taskFindNext(): Task | undefined {
	const tasks = tasksRead()
	return tasks.find((task) => task.passes === false)
}
