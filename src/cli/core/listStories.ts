import { readdirSync, existsSync } from "node:fs"
import { getStoriesFolderPath } from "@/cli/core/getStoriesFolderPath"

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
