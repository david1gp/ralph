import { storyFolderPathGet } from "@/cli/core/storyFolderPathGet"
import { existsSync, unlinkSync } from "node:fs"

export function storyDelete(filename: string): boolean {
	const storiesPath = storyFolderPathGet()
	const filePath = `${storiesPath}/${filename}`
	if (!existsSync(filePath)) {
		return false
	}
	unlinkSync(filePath)
	return true
}
