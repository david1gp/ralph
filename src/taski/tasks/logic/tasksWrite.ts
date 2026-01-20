import type { ConfigType } from "@/taski/config/ConfigType"
import { taskFilePathGet } from "@/taski/tasks/logic/taskFilePathGet"
import { writeFileSync } from "node:fs"
import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"
import { type PromiseResult } from "~utils/result/Result"

export async function tasksWrite(config: ConfigType, tasks: unknown[]): PromiseResult<void> {
  const tasksPathResult = await taskFilePathGet(config)
  if (!tasksPathResult.success) {
    return tasksPathResult
  }
  writeFileSync(tasksPathResult.data, jsonStringifyPretty(tasks))
  return { success: true } as { success: true; data: void }
}
