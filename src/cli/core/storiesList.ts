import { storyFolderPathGet } from "@/cli/core/storyFolderPathGet"
import { existsSync, readdirSync } from "node:fs"

export async function storiesList(): Promise<string[]> {
	const storiesPath = await storyFolderPathGet()
	if (!existsSync(storiesPath)) {
		return []
	}
	const files = readdirSync(storiesPath)
	return files
		.filter((f: string) => f.endsWith(".md"))
		.map((f: string) => f.replace(/^.*[\\/]/, ""))
}
