import { buildCommand, type CommandContext } from "@stricli/core"
import { taskFindNext } from "@/cli/core/taskFindNext"

export const taskNextCommand = buildCommand({
	func(this: CommandContext, _: {}) {
		const next = taskFindNext()
		if (next) {
			this.process.stdout.write(JSON.stringify(next, null, 2))
		} else {
			this.process.stdout.write("No pending tasks found")
		}
	},
	parameters: {
		positional: {
			kind: "tuple",
			parameters: [],
		},
	},
	docs: {
		brief: "Show next pending task",
	},
})
