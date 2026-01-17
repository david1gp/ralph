import { buildCommand, type CommandContext } from "@stricli/core"
import { findNextTask } from "../../core/tasks.js"

export const tasksNextCommand = buildCommand({
	func(this: CommandContext, _: {}) {
		const next = findNextTask()
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
