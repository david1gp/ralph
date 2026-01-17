import { buildCommand, type CommandContext } from "@stricli/core"
import { storyDelete } from "@/cli/core/storyDelete"

export const storyDeleteCommand = buildCommand({
	func(this: CommandContext, _: {}, filename: string) {
		const deleted = storyDelete(filename)
		if (deleted) {
			this.process.stdout.write(`Story "${filename}" deleted successfully`)
		} else {
			throw new Error(`Story "${filename}" not found`)
		}
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
		brief: "Delete a story by filename",
	},
})
