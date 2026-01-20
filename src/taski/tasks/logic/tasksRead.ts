import type { ConfigType } from "@/taski/config/ConfigType"
import type { TaskType } from "@/taski/tasks/data/TaskType"
import { taskSchema } from "@/taski/tasks/data/taskSchema"
import { taskFilePathGet } from "@/taski/tasks/logic/taskFilePathGet"
import { existsSync, readFileSync } from "node:fs"
import { array, parseJson, pipe, safeParse, string, summarize } from "valibot"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"

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
