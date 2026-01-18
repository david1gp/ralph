import { storyFolderPathGet } from "@/cli/core/stories/storyFolderPathGet"
import { storyIdGenerate, type StoryIdResult } from "@/cli/core/stories/storyIdGenerate"
import type { ConfigType } from "@/cli/data/ConfigType"
import { writeFileSync } from "node:fs"
import { createResult, type PromiseResult } from "~utils/result/Result"

export interface StoryCreateParams {
	shortStoryTitle: string
	projectDir: string
	content: string
}

export async function storyCreate(config: ConfigType, params: StoryCreateParams): PromiseResult<{ filePath: string; idResult: StoryIdResult }> {
	const storiesPathResult = await storyFolderPathGet(config)
	if (!storiesPathResult.success) {
		return storiesPathResult
	}
	const storiesPath = storiesPathResult.data
	const idResult = storyIdGenerate(config, params.projectDir)
	const filename = idResult.globalIdFormatted + "_" + idResult.abbr + "-" + idResult.projectIdFormatted + "_" + params.shortStoryTitle + ".md"
	const filePath = storiesPath + "/" + filename
	writeFileSync(filePath, params.content)
	return createResult({ filePath, idResult })
}
