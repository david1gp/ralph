import { storyFolderPathGet } from "@/cli/core/storyFolderPathGet"
import { writeFileSync } from "node:fs"

export async function storyCreate(filename: string, content: string): Promise<string> {
	const filenameWithExt = filename.endsWith(".md") ? filename : `${filename}.md`
	const storiesPath = await storyFolderPathGet()
	const filePath = `${storiesPath}/${filenameWithExt}`
	writeFileSync(filePath, content)
	return filePath
}
