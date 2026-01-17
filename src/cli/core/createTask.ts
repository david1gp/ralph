import { readTasks } from "@/cli/core/readTasks"
import { writeTasks } from "@/cli/core/writeTasks"
import { validateTask } from "@/cli/data/taskSchema"
import type { Task } from "@/cli/data/TaskType"

export function createTask(task: Task): Task {
	const tasks = readTasks()
	const newTask = validateTask(task)
	tasks.push(newTask)
	writeTasks(tasks)
	return newTask
}
