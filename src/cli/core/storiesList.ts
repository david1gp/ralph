import { storyFolderPathGet } from "@/cli/core/storyFolderPathGet"
import { existsSync, readdirSync } from "node:fs"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function storiesList(): PromiseResult<string[]> {
	const storiesPathResult = await storyFolderPathGet()
	if (!storiesPathResult.success) {
		return storiesPathResult
	}
	const storiesPath = storiesPathResult.data
	if (!existsSync(storiesPath)) {
		return createResult([])
	}
	const files = readdirSync(storiesPath)
	return createResult(
		files
			.filter((f: string) => f.endsWith(".md"))
			.map((f: string) => f.replace(/^.*[\\/]/, ""))
	)
}
