import { storyFolderPathGet } from "@/cli/core/storyFolderPathGet"
import { existsSync, unlinkSync } from "node:fs"

export async function storyDelete(filename: string): Promise<boolean> {
	const storiesPath = await storyFolderPathGet()
	const filePath = `${storiesPath}/${filename}`
	if (!existsSync(filePath)) {
		return false
	}
	unlinkSync(filePath)
	return true
}
