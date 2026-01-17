import { writeFileSync } from "node:fs"
import { getStoriesFolderPath } from "@/cli/core/getStoriesFolderPath"

export function createStory(filename: string, content: string): void {
	if (!filename.endsWith(".md")) {
		filename = `${filename}.md`
	}
	const storiesPath = getStoriesFolderPath()
	const filePath = `${storiesPath}/${filename}`
	writeFileSync(filePath, content)
}
