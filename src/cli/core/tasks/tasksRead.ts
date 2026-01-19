import { taskFilePathGet } from "@/cli/core/tasks/taskFilePathGet"
import type { ConfigType } from "@/cli/data/ConfigType"
import type { TaskType } from "@/cli/data/TaskType"
import { taskSchema } from "@/cli/data/taskSchema"
import { existsSync, readFileSync } from "node:fs"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"
import { array, parseJson, pipe, safeParse, string, summarize } from "valibot"

export async function tasksRead(config: ConfigType): PromiseResult<TaskType[]> {
  const tasksPathResult = await taskFilePathGet(config)
  if (!tasksPathResult.success) {
    return tasksPathResult
  }
  const tasksPath = tasksPathResult.data
  if (!existsSync(tasksPath)) {
    return createResult([])
  }
  const content = readFileSync(tasksPath, "utf-8")
  const result = safeParse(pipe(string(), parseJson(), array(taskSchema)), content)
  if (!result.success) {
    return createError("tasksRead", summarize(result.issues))
  }
  return createResult(result.output)
}
