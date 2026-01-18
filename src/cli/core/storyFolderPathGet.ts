import { configGet } from "@/cli/core/configGet"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function storyFolderPathGet(): PromiseResult<string> {
	const configResult = await configGet()
	if (!configResult.success) {
		return configResult
	}
	return createResult(configResult.data.storiesFolder)
}
