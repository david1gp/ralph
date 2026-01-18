import { buildCommand, type CommandContext } from "@stricli/core"
import { taskDelete } from "@/cli/core/taskDelete"

export const taskDeleteCommand = buildCommand({
	async func(this: CommandContext, _: {}, id: string) {
		const deleted = await taskDelete(id)
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
