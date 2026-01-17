import { buildCommand, type CommandContext } from "@stricli/core"
import { tasksRead } from "@/cli/core/tasksRead"

export const taskListCommand = buildCommand({
	func(this: CommandContext, _: {}) {
		const tasks = tasksRead()
		this.process.stdout.write(JSON.stringify(tasks, null, 2))
	},
	parameters: {
		positional: {
			kind: "tuple",
			parameters: [],
		},
	},
	docs: {
		brief: "List all tasks",
	},
})
