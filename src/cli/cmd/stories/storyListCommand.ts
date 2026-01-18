import { buildCommand, type CommandContext } from "@stricli/core"
import { storiesList } from "@/cli/core/storiesList"
import { configLoad } from "@/cli/core/configLoad"

interface ListFlags {
	config?: string
}

export const storyListCommand = buildCommand({
	async func(this: CommandContext, flags: ListFlags) {
		const configResult = await configLoad(flags.config)
		if (!configResult.success) {
			console.error(JSON.stringify(configResult))
			process.exit(1)
		}
		const config = configResult.data

		const storiesResult = await storiesList(config)
		if (!storiesResult.success) {
			console.error(JSON.stringify(storiesResult))
			process.exit(1)
		}
		this.process.stdout.write(JSON.stringify(storiesResult.data, null, 2))
	},
	parameters: {
		positional: {
			kind: "tuple",
			parameters: [],
		},
		flags: {
			config: {
				kind: "parsed",
				parse: String,
				optional: true,
				brief: "Path to config file (directory with taski.json or direct path)",
			},
		},
	},
	docs: {
		brief: "List all stories",
	},
})
