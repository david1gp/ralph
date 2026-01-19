import { taskArchivedDirPathGet } from "@/cli/core/tasks/archive/taskArchivedDirPathGet"
import type { ConfigType } from "@/cli/data/ConfigType"
import type { TaskType } from "@/cli/data/TaskType"
import { existsSync, mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function tasksArchivedWrite(config: ConfigType, yearMonth: string, tasks: TaskType[]): PromiseResult<void> {
  const dirResult = await taskArchivedDirPathGet(config)
  if (!dirResult.success) {
    return dirResult
  }
  const archiveDir = dirResult.data

  if (!existsSync(archiveDir)) {
    mkdirSync(archiveDir, { recursive: true })
  }

  const archiveFile = join(archiveDir, `${yearMonth}.json`)
  writeFileSync(archiveFile, jsonStringifyPretty(tasks))
  return createResult(undefined)
}
