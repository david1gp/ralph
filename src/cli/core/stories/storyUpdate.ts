import { storyFolderPathGet } from "@/cli/core/stories/storyFolderPathGet"
import { storyRead } from "@/cli/core/stories/storyRead"
import type { ConfigType } from "@/cli/data/ConfigType"
import type { StoryType } from "@/cli/data/StoryType"
import { storyValidate } from "@/cli/data/storyValidate"
import { existsSync, writeFileSync } from "node:fs"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"

export async function storyUpdate(
  config: ConfigType,
  filename: string,
  updates: Partial<StoryType>,
): PromiseResult<StoryType> {
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

  const existingStoryResult = await storyRead(config, filename)
  if (!existingStoryResult.success) {
    return existingStoryResult
  }
  const existingStory = existingStoryResult.data
  const updatedStory = storyValidate({ ...existingStory, ...updates })

  const content = storyToMarkdown(updatedStory)
  writeFileSync(filePath, content)

  return createResult(updatedStory)
}

function storyToMarkdown(story: StoryType): string {
  let content = `# Story: ${story.title}

## Description

${story.description}

## Goals

`
  for (const goal of story.goals) {
    content += `- ${goal}
`
  }

  content += `
## User Tasks

`
  for (const taskId of story.userTasks) {
    content += `### ${taskId}: \n`
  }

  return content
}
