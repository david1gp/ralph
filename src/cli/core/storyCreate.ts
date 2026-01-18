import { storyFolderPathGet } from "@/cli/core/storyFolderPathGet"
import type { ConfigType } from "@/cli/data/ConfigType"
import { writeFileSync } from "node:fs"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function storyCreate(config: ConfigType, filename: string, content: string): PromiseResult<string> {
	const filenameWithExt = filename.endsWith(".md") ? filename : `${filename}.md`
	const storiesPathResult = await storyFolderPathGet(config)
	if (!storiesPathResult.success) {
		return storiesPathResult
	}
	const storiesPath = storiesPathResult.data
	const filePath = `${storiesPath}/${filenameWithExt}`
	writeFileSync(filePath, content)
	return createResult(filePath)
}
