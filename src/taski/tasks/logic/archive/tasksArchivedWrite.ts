import type { ConfigType } from "@/taski/config/ConfigType"
import type { TaskType } from "@/taski/tasks/data/TaskType"
import { taskArchivedDirPathGet } from "@/taski/tasks/logic/archive/taskArchivedDirPathGet"
import { existsSync, mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"
import { createResult, type PromiseResult } from "~result"

export async function tasksArchivedWrite(
  config: ConfigType,
  yearMonth: string,
  tasks: TaskType[],
): PromiseResult<void> {
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
