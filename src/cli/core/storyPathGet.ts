import { join } from "node:path"
import { storyFolderPathGet } from "@/cli/core/storyFolderPathGet"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function storyPathGet(filename: string): PromiseResult<string> {
	if (filename === "") {
		return createResult("")
	}
	if (filename.startsWith("/")) {
		return createResult(filename)
	}
	const storiesPathResult = await storyFolderPathGet()
	if (!storiesPathResult.success) {
		return storiesPathResult
	}
	return createResult(join(storiesPathResult.data, filename))
}
