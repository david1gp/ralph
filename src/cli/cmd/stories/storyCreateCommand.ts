import { buildCommand, type CommandContext } from "@stricli/core"
import { storyCreate } from "@/cli/core/storyCreate"
import { configLoad } from "@/cli/core/configLoad"

interface CreateFlags {
	filename: string
	content: string
	config?: string
}

export async function storyCreateFunc(this: CommandContext, flags: CreateFlags) {
	const configResult = await configLoad(flags.config)
	if (!configResult.success) {
		console.error(JSON.stringify(configResult))
		process.exit(1)
	}
	const config = configResult.data

	const result = await storyCreate(config, flags.filename, flags.content)
	if (!result.success) {
		console.error(JSON.stringify(result))
		process.exit(1)
	}
	this.process.stdout.write(result.data)
}

export const storyCreateCommand = buildCommand({
	func: storyCreateFunc,
	parameters: {
		flags: {
			filename: {
				kind: "parsed",
				parse: String,
				optional: false,
				brief: "Story filename",
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
