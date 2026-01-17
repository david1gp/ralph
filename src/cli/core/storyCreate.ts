import { storyFolderPathGet } from "@/cli/core/storyFolderPathGet"
import { writeFileSync } from "node:fs"

export function storyCreate(filename: string, content: string): string {
	const filenameWithExt = filename.endsWith(".md") ? filename : `${filename}.md`
	const storiesPath = storyFolderPathGet()
	const filePath = `${storiesPath}/${filenameWithExt}`
	writeFileSync(filePath, content)
	return filePath
}
