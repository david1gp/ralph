import { buildCommand, type CommandContext } from "@stricli/core"
import { storyRead } from "@/cli/core/storyRead"

export const storyReadCommand = buildCommand({
	async func(this: CommandContext, _: {}, filename: string) {
		const storyResult = await storyRead(filename)
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
	},
	docs: {
		brief: "Read a story by filename",
	},
})
