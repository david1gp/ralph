import { buildCommand, type CommandContext } from "@stricli/core"
import { storyDelete } from "@/cli/core/storyDelete"

export const storyDeleteCommand = buildCommand({
	async func(this: CommandContext, _: {}, filename: string) {
		const result = await storyDelete(filename)
		if (!result.success) {
			console.error(JSON.stringify(result))
			process.exit(1)
		}
		this.process.stdout.write(`Story "${filename}" deleted successfully`)
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
