import type { ConfigType } from "@/cli/data/ConfigType"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function storyFolderPathGet(config: ConfigType): PromiseResult<string> {
	return createResult(config.storiesFolder)
}
