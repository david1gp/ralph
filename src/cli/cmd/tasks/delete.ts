import { buildCommand, type CommandContext } from "@stricli/core"
import { deleteTask } from "@/cli/core/tasks"

export const tasksDeleteCommand = buildCommand({
	func(this: CommandContext, _: {}, id: string) {
		const deleted = deleteTask(id)
		if (deleted) {
			this.process.stdout.write(`Task "${id}" deleted successfully`)
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
		brief: "Delete a task by ID",
	},
})
