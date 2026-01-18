import { storyFolderPathGet } from "@/cli/core/storyFolderPathGet"
import { writeFileSync } from "node:fs"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function storyCreate(filename: string, content: string): PromiseResult<string> {
	const filenameWithExt = filename.endsWith(".md") ? filename : `${filename}.md`
	const storiesPathResult = await storyFolderPathGet()
	if (!storiesPathResult.success) {
		return storiesPathResult
	}
	const storiesPath = storiesPathResult.data
	const filePath = `${storiesPath}/${filenameWithExt}`
	writeFileSync(filePath, content)
	return createResult(filePath)
}
