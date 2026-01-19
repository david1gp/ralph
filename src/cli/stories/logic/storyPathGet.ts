import type { ConfigType } from "@/cli/config/ConfigType"
import { storyFolderPathGet } from "@/cli/stories/logic/storyFolderPathGet"
import { join } from "node:path"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function storyPathGet(config: ConfigType, filename: string): PromiseResult<string> {
  if (filename === "") {
    return createResult("")
  }
  if (filename.startsWith("/")) {
    return createResult(filename)
  }
  const storiesPathResult = await storyFolderPathGet(config)
  if (!storiesPathResult.success) {
    return storiesPathResult
  }
  return createResult(join(storiesPathResult.data, filename))
}
