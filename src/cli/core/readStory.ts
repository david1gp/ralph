import { readFileSync, existsSync } from "node:fs"
import { getStoriesFolderPath } from "@/cli/core/getStoriesFolderPath"
import { parseStory } from "@/cli/data/parseStory"
import type { Story } from "@/cli/data/StoryType"

export function readStory(filename: string): Story {
	const storiesPath = getStoriesFolderPath()
	const filePath = `${storiesPath}/${filename}`
	if (!existsSync(filePath)) {
		throw new Error(`Story "${filename}" not found`)
	}
	const content = readFileSync(filePath, "utf-8")
	const story = parseMarkdownToStory(content)
	const result = parseStory(story)
	if (!result.success) {
		throw new Error(`Invalid story structure: ${result.issues}`)
	}
	return result.data
}

function parseMarkdownToStory(content: string): Partial<Story> {
	const lines = content.split("\n")
	const story: Partial<Story> = {}
	let currentSection: string | null = null

	for (const line of lines) {
		const trimmedLine = line.trim()

		if (trimmedLine.startsWith("# Story: ")) {
			story.title = trimmedLine.replace("# Story: ", "")
			currentSection = null
		} else if (trimmedLine.startsWith("## ")) {
			currentSection = trimmedLine.replace("## ", "")
		} else if (currentSection === "Introduction" && story.introduction === undefined && trimmedLine !== "") {
			story.introduction = trimmedLine
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
