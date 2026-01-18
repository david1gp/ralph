import { buildCommand, type CommandContext } from "@stricli/core"
import { storyRead } from "@/cli/core/storyRead"

export const storyReadCommand = buildCommand({
	async func(this: CommandContext, _: {}, filename: string) {
		const story = await storyRead(filename)
		this.process.stdout.write(JSON.stringify(story, null, 2))
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
	},
	docs: {
		brief: "Read a story by filename",
	},
})
