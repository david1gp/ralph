import type { ConfigType } from "@/taski/config/ConfigType"
import { storyFolderPathGet } from "@/taski/stories/logic/storyFolderPathGet"
import { existsSync, readFileSync } from "node:fs"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"

export async function storyRead(config: ConfigType, filename: string): PromiseResult<string> {
  const storiesPathResult = await storyFolderPathGet(config)
  if (!storiesPathResult.success) {
    return storiesPathResult
  }
  const storiesPath = storiesPathResult.data
  const filePath = `${storiesPath}/${filename}`
  if (!existsSync(filePath)) {
    return createError("storyRead", `Story "${filename}" not found`)
  }
  const content = readFileSync(filePath, "utf-8")
  return createResult(content)
}
