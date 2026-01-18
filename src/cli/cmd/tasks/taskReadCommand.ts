import { buildCommand, type CommandContext } from "@stricli/core"
import { tasksRead } from "@/cli/core/tasksRead"

export const taskReadCommand = buildCommand({
	async func(this: CommandContext, _: {}, id: string) {
		const tasksResult = await tasksRead()
		if (!tasksResult.success) {
			console.error(JSON.stringify(tasksResult))
			process.exit(1)
		}
		const tasks = tasksResult.data
		const task = tasks.find((t) => t.id === id)
		if (task) {
			this.process.stdout.write(JSON.stringify(task, null, 2))
		} else {
			const errorResult = { success: false, op: "taskRead", errorMessage: `Task "${id}" not found` }
			console.error(JSON.stringify(errorResult))
			process.exit(1)
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
