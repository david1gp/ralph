import type { ConfigType } from "@/taski/config/ConfigType"
import { storyFolderPathGet } from "@/taski/stories/logic/storyFolderPathGet"
import { existsSync, unlinkSync } from "node:fs"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"

export async function storyDelete(config: ConfigType, filename: string): PromiseResult<boolean> {
  const storiesPathResult = await storyFolderPathGet(config)
  if (!storiesPathResult.success) {
    return storiesPathResult
  }
  const storiesPath = storiesPathResult.data
  const filePath = `${storiesPath}/${filename}`
  if (!existsSync(filePath)) {
    return createError("storyDelete", `Story "${filename}" not found`)
  }
  unlinkSync(filePath)
  return createResult(true)
}
