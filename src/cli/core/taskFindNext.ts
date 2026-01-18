import { tasksRead } from "@/cli/core/tasksRead"
import type { Task } from "@/cli/data/TaskType"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function taskFindNext(): PromiseResult<Task | undefined> {
	const tasksResult = await tasksRead()
	if (!tasksResult.success) {
		return tasksResult
	}
	const task = tasksResult.data.find((task) => task.passes === false)
	return createResult(task)
}
