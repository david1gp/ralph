import { tasksRead } from "@/cli/core/tasksRead"
import { tasksWrite } from "@/cli/core/tasksWrite"
import { taskValidate } from "@/cli/data/taskValidate"
import type { Task } from "@/cli/data/TaskType"

export async function taskCreate(task: Task): Promise<Task> {
	const tasks = await tasksRead()
	const newTask = taskValidate(task)
	tasks.push(newTask)
	await tasksWrite(tasks)
	return newTask
}
