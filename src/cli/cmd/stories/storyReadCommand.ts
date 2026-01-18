import { buildCommand, type CommandContext } from "@stricli/core"
import { storyRead } from "@/cli/core/storyRead"
import { configLoad } from "@/cli/core/configLoad"

interface ReadFlags {
	config?: string
}

export const storyReadCommand = buildCommand({
	async func(this: CommandContext, flags: ReadFlags, filename: string) {
		const configResult = await configLoad(flags.config)
		if (!configResult.success) {
			console.error(JSON.stringify(configResult))
			process.exit(1)
		}
		const config = configResult.data

		const storyResult = await storyRead(config, filename)
		if (!storyResult.success) {
			console.error(JSON.stringify(storyResult))
			process.exit(1)
		}
		this.process.stdout.write(JSON.stringify(storyResult.data, null, 2))
	},
	parameters: {
		positional: {
			kind: "tuple",
			parameters: [
				{
					brief: "Story filename",
					parse: String,
					placeholder: "filename",
				},
			],
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
		brief: "Read a story by filename",
	},
})
