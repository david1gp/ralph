import type { ConfigType } from "@/taski/config/ConfigType"
import { createResult, type PromiseResult } from "~result"

export async function storyFolderPathGet(config: ConfigType): PromiseResult<string> {
  return createResult(config.storiesFolder)
}
