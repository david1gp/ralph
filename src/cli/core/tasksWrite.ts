import { taskFilePathGet } from "@/cli/core/taskFilePathGet"
import type { ConfigType } from "@/cli/data/ConfigType"
import { writeFileSync } from "node:fs"
import { type PromiseResult } from "~utils/result/Result"

export async function tasksWrite(config: ConfigType, tasks: unknown[]): PromiseResult<void> {
	const tasksPathResult = await taskFilePathGet(config)
	if (!tasksPathResult.success) {
		return tasksPathResult
	}
	writeFileSync(tasksPathResult.data, JSON.stringify(tasks, null, 2))
	return { success: true } as { success: true; data: void }
}
