import { tasksRead } from "@/cli/core/tasksRead"
import { tasksWrite } from "@/cli/core/tasksWrite"
import { taskValidate } from "@/cli/data/taskValidate"
import type { Task } from "@/cli/data/TaskType"

export function taskCreate(task: Task): Task {
	const tasks = tasksRead()
	const newTask = taskValidate(task)
	tasks.push(newTask)
	tasksWrite(tasks)
	return newTask
}
