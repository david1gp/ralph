import type { ConfigType } from "@/cli/data/ConfigType"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function taskArchivedDirPathGet(config: ConfigType): PromiseResult<string> {
  return createResult(config.tasksArchivedDir)
}
