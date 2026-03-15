import type { ConfigType } from "@/taski/config/ConfigType"
import { storyFolderPathGet } from "@/taski/stories/logic/storyFolderPathGet"
import { join } from "node:path"
import { createResult, type PromiseResult } from "~result"

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
