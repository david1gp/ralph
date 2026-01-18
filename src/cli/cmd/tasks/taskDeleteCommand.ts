import { buildCommand, type CommandContext } from "@stricli/core"
import { taskDelete } from "@/cli/core/taskDelete"

export const taskDeleteCommand = buildCommand({
	async func(this: CommandContext, _: {}, id: string) {
		const result = await taskDelete(id)
		if (!result.success) {
			console.error(JSON.stringify(result))
			process.exit(1)
		}
		this.process.stdout.write(`Task "${id}" deleted successfully`)
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
