import type { ConfigType } from "@/taski/config/ConfigType"
import type { TaskType } from "@/taski/tasks/data/TaskType"
import { taskSchema } from "@/taski/tasks/data/taskSchema"
import { taskArchivedDirPathGet } from "@/taski/tasks/logic/archive/taskArchivedDirPathGet"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { array, parseJson, pipe, safeParse, string, summarize } from "valibot"
import { createError, createResult, type PromiseResult } from "~result"

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
