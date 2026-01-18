import { taskFilePathGet } from "@/cli/core/taskFilePathGet"
import { taskParse } from "@/cli/data/taskParse"
import type { Task } from "@/cli/data/TaskType"
import { existsSync, readFileSync } from "node:fs"
import { createResult, createError, type PromiseResult } from "~utils/result/Result"

export async function tasksRead(): PromiseResult<Task[]> {
	const tasksPathResult = await taskFilePathGet()
	if (!tasksPathResult.success) {
		return tasksPathResult
	}
	const tasksPath = tasksPathResult.data
	if (!existsSync(tasksPath)) {
		return createResult([])
	}
	const content = readFileSync(tasksPath, "utf-8")
	const parsed = JSON.parse(content)
	if (!Array.isArray(parsed)) {
		return createError("tasksRead", "tasks.json must contain an array")
	}
	const tasks: Task[] = []
	for (let index = 0; index < parsed.length; index++) {
		const task = parsed[index]
		const result = taskParse(task)
		if (!result.success) {
			return createError("tasksRead", `Invalid task at index ${index}: ${result.issues}`)
		}
		tasks.push(result.data)
	}
	return createResult(tasks)
}
