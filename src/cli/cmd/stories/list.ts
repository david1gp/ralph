import { buildCommand, type CommandContext } from "@stricli/core"
import { listStories } from "@/cli/core/stories"

export const storiesListCommand = buildCommand({
	func(this: CommandContext, _: {}) {
		const stories = listStories()
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
