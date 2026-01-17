import { storyFolderPathGet } from "@/cli/core/storyFolderPathGet"
import { writeFileSync } from "node:fs"

export function storyCreate(filename: string, content: string): void {
	if (!filename.endsWith(".md")) {
		filename = `${filename}.md`
	}
	const storiesPath = storyFolderPathGet()
	const filePath = `${storiesPath}/${filename}`
	writeFileSync(filePath, content)
}
