import type { ConfigType } from "@/taski/config/ConfigType"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function taskFilePathGet(config: ConfigType): PromiseResult<string> {
  return createResult(config.tasksFile)
}
