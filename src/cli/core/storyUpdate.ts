import { storyFolderPathGet } from "@/cli/core/storyFolderPathGet"
import { storyRead } from "@/cli/core/storyRead"
import { storyValidate } from "@/cli/data/storyValidate"
import type { Story } from "@/cli/data/StoryType"
import { existsSync, writeFileSync } from "node:fs"
import { createResult, createError, type PromiseResult } from "~utils/result/Result"

export async function storyUpdate(filename: string, updates: Partial<Story>): PromiseResult<Story> {
	const storiesPathResult = await storyFolderPathGet()
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

	const existingStoryResult = await storyRead(filename)
	if (!existingStoryResult.success) {
		return existingStoryResult
	}
	const existingStory = existingStoryResult.data
	const updatedStory = storyValidate({ ...existingStory, ...updates })

	const content = storyToMarkdown(updatedStory)
	writeFileSync(filePath, content)

	return createResult(updatedStory)
}

function storyToMarkdown(story: Story): string {
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
