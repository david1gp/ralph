import { buildCommand, type CommandContext } from "@stricli/core"
import { storyCreate } from "@/cli/core/storyCreate"

export const storyCreateCommand = buildCommand({
	func(this: CommandContext, _: {}, filename: string, content: string) {
		storyCreate(filename, content)
		this.process.stdout.write(`Story "${filename}" created successfully`)
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
				{
					brief: "Story content",
					parse: String,
					placeholder: "content",
				},
			],
		},
	},
	docs: {
		brief: "Create a new story",
	},
})
