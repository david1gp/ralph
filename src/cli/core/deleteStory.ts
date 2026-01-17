import { unlinkSync, existsSync } from "node:fs"
import { getStoriesFolderPath } from "@/cli/core/getStoriesFolderPath"

export function deleteStory(filename: string): boolean {
	const storiesPath = getStoriesFolderPath()
	const filePath = `${storiesPath}/${filename}`
	if (!existsSync(filePath)) {
		return false
	}
	unlinkSync(filePath)
	return true
}
