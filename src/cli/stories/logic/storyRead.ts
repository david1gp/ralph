import type { ConfigType } from "@/cli/config/ConfigType"
import { storyParse } from "@/cli/stories/data/storyParse"
import type { StoryType } from "@/cli/stories/data/StoryType"
import { storyFolderPathGet } from "@/cli/stories/logic/storyFolderPathGet"
import { existsSync, readFileSync } from "node:fs"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"

export async function storyRead(config: ConfigType, filename: string): PromiseResult<StoryType> {
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
  const story = parseMarkdownToStory(content)
  const result = storyParse(story)
  if (!result.success) {
    return createError("storyRead", `Invalid story structure: ${result.issues}`)
  }
  return createResult(result.data)
}

function parseMarkdownToStory(content: string): Partial<StoryType> {
  const lines = content.split("\n")
  const story: Partial<StoryType> = {}
  let currentSection: string | null = null

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (trimmedLine.startsWith("# Story: ")) {
      story.title = trimmedLine.replace("# Story: ", "")
      currentSection = null
    } else if (trimmedLine.startsWith("## ")) {
      currentSection = trimmedLine.replace("## ", "")
    } else if (currentSection === "Description" && story.description === undefined && trimmedLine !== "") {
      story.description = trimmedLine
    } else if (currentSection === "Goals" && trimmedLine.startsWith("- ")) {
      if (!story.goals) story.goals = []
      story.goals.push(trimmedLine.replace("- ", ""))
    } else if (currentSection === "User Tasks" && trimmedLine.startsWith("### ")) {
      if (!story.userTasks) story.userTasks = []
      const taskMatch = trimmedLine.match(/###\s+([A-Z]+-\d+)/)
      const taskId = taskMatch?.[1]
      if (taskId) {
        story.userTasks.push(taskId)
      }
    }
  }

  return story
}
