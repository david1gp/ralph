import { storyFolderPathGet } from "@/cli/core/storyFolderPathGet"
import { existsSync, unlinkSync } from "node:fs"
import { createResult, createError, type PromiseResult } from "~utils/result/Result"

export async function storyDelete(filename: string): PromiseResult<boolean> {
	const storiesPathResult = await storyFolderPathGet()
	if (!storiesPathResult.success) {
		return storiesPathResult
	}
	const storiesPath = storiesPathResult.data
	const filePath = `${storiesPath}/${filename}`
	if (!existsSync(filePath)) {
		return createError("storyDelete", `Story "${filename}" not found`)
	}
	unlinkSync(filePath)
	return createResult(true)
}
