import { tasksRead } from "@/cli/core/tasksRead"
import type { TaskType } from "@/cli/data/TaskType"
import type { ConfigType } from "@/cli/data/ConfigType"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function taskFindNext(config: ConfigType): PromiseResult<TaskType | undefined> {
	const tasksResult = await tasksRead(config)
	if (!tasksResult.success) {
		return tasksResult
	}
	const task = tasksResult.data.find((task) => task.passes === false)
	return createResult(task)
}
