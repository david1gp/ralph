import { buildCommand, type CommandContext } from "@stricli/core"
import { readTasks } from "../../core/tasks.js"

export const tasksListCommand = buildCommand({
	func(this: CommandContext, _: {}) {
		const tasks = readTasks()
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
