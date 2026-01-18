import { tasksRead } from "@/cli/core/tasksRead"
import { tasksWrite } from "@/cli/core/tasksWrite"
import type { TaskType } from "@/cli/data/TaskType"
import type { ConfigType } from "@/cli/data/ConfigType"
import { taskValidate } from "@/cli/data/taskValidate"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function taskCreate(config: ConfigType, task: TaskType): PromiseResult<TaskType> {
	const tasksResult = await tasksRead(config)
	if (!tasksResult.success) {
		return tasksResult
	}
	const tasks = tasksResult.data
	const newTask = taskValidate(task)
	tasks.push(newTask)
	const writeResult = await tasksWrite(config, tasks)
	if (!writeResult.success) {
		return writeResult
	}
	return createResult(newTask)
}
