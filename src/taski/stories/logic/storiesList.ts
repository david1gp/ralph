import type { ConfigType } from "@/taski/config/ConfigType"
import { storyFolderPathGet } from "@/taski/stories/logic/storyFolderPathGet"
import { existsSync, readdirSync } from "node:fs"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function storiesList(config: ConfigType): PromiseResult<string[]> {
  const storiesPathResult = await storyFolderPathGet(config)
  if (!storiesPathResult.success) {
    return storiesPathResult
  }
  const storiesPath = storiesPathResult.data
  if (!existsSync(storiesPath)) {
    return createResult([])
  }
  const files = readdirSync(storiesPath)
  return createResult(files.filter((f: string) => f.endsWith(".md")).map((f: string) => f.replace(/^.*[\\/]/, "")))
}
