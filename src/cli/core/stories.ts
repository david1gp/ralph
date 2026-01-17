import { readFileSync, writeFileSync, existsSync, unlinkSync, readdirSync } from "node:fs"
import { getStoriesFolderPath } from "@/cli/core/config"
import { parseStory } from "@/cli/data/validators"
import type { Story } from "@/cli/data/types"

export function listStories(): string[] {
	const storiesPath = getStoriesFolderPath()
	if (!existsSync(storiesPath)) {
		return []
	}
	const files = readdirSync(storiesPath)
	return files
		.filter((f: string) => f.endsWith(".md"))
		.map((f: string) => f.replace(/^.*[\\/]/, ""))
}

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

export function createStory(filename: string, content: string): void {
	if (!filename.endsWith(".md")) {
		filename = `${filename}.md`
	}
	const storiesPath = getStoriesFolderPath()
	const filePath = `${storiesPath}/${filename}`
	writeFileSync(filePath, content)
}

export function deleteStory(filename: string): boolean {
	const storiesPath = getStoriesFolderPath()
	const filePath = `${storiesPath}/${filename}`
	if (!existsSync(filePath)) {
		return false
	}
	unlinkSync(filePath)
	return true
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
