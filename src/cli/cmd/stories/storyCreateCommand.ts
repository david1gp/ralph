import { configGet } from "@/cli/core/config/configGet"
import { configSave } from "@/cli/core/config/configSave"
import { storyCreate } from "@/cli/core/stories/storyCreate"
import { projectDirExists, shortStoryTitleFormat } from "@/cli/core/stories/storyInputValidate"
import { buildCommand, type CommandContext } from "@stricli/core"

interface CreateFlags {
	shortStoryTitle: string
	projectDir: string
	content: string
	config?: string
}

export async function storyCreateFunc(this: CommandContext, flags: CreateFlags) {
	const configResult = await configGet()
	if (!configResult.success) {
		console.error(configResult)
		process.exit(1)
	}
	const config = configResult.data

	const dirResult = await projectDirExists(flags.projectDir)
	if (!dirResult.success) {
		const errorResult = { success: false, op: "storyCreateCommand", errorMessage: dirResult.error }
		console.error(errorResult)
		process.exit(1)
	}

	const titleResult = shortStoryTitleFormat(flags.shortStoryTitle)
	if (!titleResult.success) {
		const errorResult = { success: false, op: "storyCreateCommand", errorMessage: titleResult.error }
		console.error(errorResult)
		process.exit(1)
	}

	const result = await storyCreate(config, {
		shortStoryTitle: titleResult.formatted!,
		projectDir: flags.projectDir,
		content: flags.content,
	})
	if (!result.success) {
		console.error(result)
		process.exit(1)
	}

	config.storyIdNumber = (config.storyIdNumber ?? 1) + 1
	config.projectStoryIdNumber = config.projectStoryIdNumber ?? {}
	config.projectStoryIdNumber[flags.projectDir] = (config.projectStoryIdNumber[flags.projectDir] ?? 1) + 1
	await configSave(config)

	const filename = result.data.filePath.split("/").pop()!
	this.process.stdout.write(filename)
}

export const storyCreateCommand = buildCommand({
	func: storyCreateFunc,
	parameters: {
		flags: {
			shortStoryTitle: {
				kind: "parsed",
				parse: String,
				optional: false,
				brief: "Short story title (spaces and underscores will be replaced with dashes)",
			},
			projectDir: {
				kind: "parsed",
				parse: String,
				optional: false,
				brief: "Project directory path",
			},
			content: {
				kind: "parsed",
				parse: String,
				optional: false,
				brief: "Story content",
			},
			config: {
				kind: "parsed",
				parse: String,
				optional: true,
				brief: "Path to config file (directory with taski.json or direct path)",
			},
		},
	},
	docs: {
		brief: "Create a new story",
	},
})
