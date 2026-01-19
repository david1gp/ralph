import type { ConfigType } from "@/cli/config/ConfigType"
import { storyFolderPathGet } from "@/cli/stories/logic/storyFolderPathGet"
import { storyIdGenerate, type StoryIdResult } from "@/cli/stories/logic/storyIdGenerate"
import { writeFileSync } from "node:fs"
import { createResult, type PromiseResult } from "~utils/result/Result"

export interface StoryCreateParams {
  shortStoryTitle: string
  projectPath: string
  content: string
}

export async function storyCreate(
  config: ConfigType,
  params: StoryCreateParams,
): PromiseResult<{ filePath: string; idResult: StoryIdResult }> {
  const storiesPathResult = await storyFolderPathGet(config)
  if (!storiesPathResult.success) {
    return storiesPathResult
  }
  const storiesPath = storiesPathResult.data
  const idResult = storyIdGenerate(config, params.projectPath)
  const filename =
    idResult.globalIdFormatted +
    "_" +
    idResult.abbr +
    "-" +
    idResult.projectIdFormatted +
    "_" +
    params.shortStoryTitle +
    ".md"
  const filePath = storiesPath + "/" + filename
  writeFileSync(filePath, params.content)
  return createResult({ filePath, idResult })
}
