import { buildCommand, type CommandContext } from "@stricli/core"
import { storiesList } from "@/cli/core/storiesList"

export const storyListCommand = buildCommand({
	async func(this: CommandContext, _: {}) {
		const storiesResult = await storiesList()
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
	},
	docs: {
		brief: "List all stories",
	},
})
