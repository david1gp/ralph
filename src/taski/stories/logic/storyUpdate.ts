import type { ConfigType } from "@/taski/config/ConfigType"
import { storyFolderPathGet } from "@/taski/stories/logic/storyFolderPathGet"
import { existsSync, writeFileSync } from "node:fs"
import { createError, createResult, type PromiseResult } from "~result"

export async function storyUpdate(
  config: ConfigType,
  filename: string,
  content: string,
): PromiseResult<string> {
  const storiesPathResult = await storyFolderPathGet(config)
  if (!storiesPathResult.success) {
    return storiesPathResult
  }
  const storiesPath = storiesPathResult.data
  let filePath = `${storiesPath}/${filename}`
  if (!existsSync(`${filePath}`) && existsSync(`${filePath}.md`)) {
    filePath = `${filePath}.md`
  }
  if (!existsSync(filePath)) {
    return createError("storyUpdate", `Story "${filename}" not found`)
  }

  writeFileSync(filePath, content)
  return createResult(content)
}
