import { buildCommand, type CommandContext } from "@stricli/core"
import { storiesList } from "@/cli/core/storiesList"

export const storyListCommand = buildCommand({
	func(this: CommandContext, _: {}) {
		const stories = storiesList()
		this.process.stdout.write(JSON.stringify(stories, null, 2))
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
