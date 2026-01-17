import { buildCommand, type CommandContext } from "@stricli/core"
import { tasksRead } from "@/cli/core/tasksRead"

export const taskReadCommand = buildCommand({
	func(this: CommandContext, _: {}, id: string) {
		const tasks = tasksRead()
		const task = tasks.find((t) => t.id === id)
		if (task) {
			this.process.stdout.write(JSON.stringify(task, null, 2))
		} else {
			throw new Error(`Task "${id}" not found`)
		}
	},
	parameters: {
		positional: {
			kind: "tuple",
			parameters: [
				{
					brief: "Task ID",
					parse: String,
					placeholder: "id",
				},
			],
		},
	},
	docs: {
		brief: "Read a task by ID",
	},
})
