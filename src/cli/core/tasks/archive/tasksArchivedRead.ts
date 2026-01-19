import { taskArchivedDirPathGet } from "@/cli/core/tasks/archive/taskArchivedDirPathGet"
import type { ConfigType } from "@/cli/data/ConfigType"
import type { TaskType } from "@/cli/data/TaskType"
import { taskSchema } from "@/cli/data/taskSchema"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { array, parseJson, pipe, safeParse, string, summarize } from "valibot"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"

export async function tasksArchivedRead(config: ConfigType, yearMonth: string): PromiseResult<TaskType[]> {
  const dirResult = await taskArchivedDirPathGet(config)
  if (!dirResult.success) {
    return dirResult
  }
  const archiveDir = dirResult.data
  const archiveFile = join(archiveDir, `${yearMonth}.json`)

  if (!existsSync(archiveFile)) {
    return createResult([])
  }

  const content = readFileSync(archiveFile, "utf-8")
  const result = safeParse(pipe(string(), parseJson(), array(taskSchema)), content)
  if (!result.success) {
    return createError("tasksArchivedRead", summarize(result.issues))
  }
  return createResult(result.output)
}
