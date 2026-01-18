import { stat } from "node:fs/promises"

export interface StoryTitleResult {
	success: boolean
	formatted?: string
	error?: string
}

export function shortStoryTitleFormat(title: string): StoryTitleResult {
	const allowedPattern = /^[a-zA-Z0-9 _\-]+$/
	if (!allowedPattern.test(title)) {
		return { success: false, error: "Title contains invalid characters. Only alphanumeric, spaces, underscores, and dashes are allowed." }
	}
	const formatted = title.replace(/[ _]/g, "-")
	return { success: true, formatted }
}

export async function projectDirExists(dir: string): Promise<{ success: boolean; error?: string }> {
	try {
		const stats = await stat(dir)
		if (!stats.isDirectory()) {
			return { success: false, error: "Path \"".concat(dir, "\" is not a directory.") }
		}
		return { success: true }
	} catch {
		return { success: false, error: "Directory \"".concat(dir, "\" does not exist.") }
	}
}
