import { storyFolderPathGet } from "@/cli/core/storyFolderPathGet"
import { storyRead } from "@/cli/core/storyRead"
import { storyValidate } from "@/cli/data/storyValidate"
import type { Story } from "@/cli/data/StoryType"
import { existsSync, writeFileSync } from "node:fs"

export async function storyUpdate(filename: string, updates: Partial<Story>): Promise<Story> {
	const storiesPath = await storyFolderPathGet()
	let filePath = `${storiesPath}/${filename}`
	if (!existsSync(`${filePath}`) && existsSync(`${filePath}.md`)) {
		filePath = `${filePath}.md`
	}
	if (!existsSync(filePath)) {
		throw new Error(`Story "${filename}" not found`)
	}

	const existingStory = await storyRead(filename)
	const updatedStory = storyValidate({ ...existingStory, ...updates })

	const content = storyToMarkdown(updatedStory)
	writeFileSync(filePath, content)

	return updatedStory
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
