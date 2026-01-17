import { buildCommand, type CommandContext } from "@stricli/core"
import { readStory } from "@/cli/core/readStory"

export const storiesReadCommand = buildCommand({
	func(this: CommandContext, _: {}, filename: string) {
		const story = readStory(filename)
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
