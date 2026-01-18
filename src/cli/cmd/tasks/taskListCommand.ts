import { configLoad } from "@/cli/core/config/configLoad"
import { tasksRead } from "@/cli/core/tasks/tasksRead"
import { buildCommand, type CommandContext } from "@stricli/core"

interface ListFlags {
	config?: string
}

export const taskListCommand = buildCommand({
	async func(this: CommandContext, flags: ListFlags) {
		const configResult = await configLoad(flags.config)
		if (!configResult.success) {
			console.error(JSON.stringify(configResult))
			process.exit(1)
		}
		const config = configResult.data

		const tasks = await tasksRead(config)
		this.process.stdout.write(JSON.stringify(tasks, null, 2))
	},
	parameters: {
		positional: {
			kind: "tuple",
			parameters: [],
		},
		flags: {
			config: {
				kind: "parsed",
				parse: String,
				optional: true,
				brief: "Path to config file (directory with taski.json or direct path)",
			},
		},
	},
	docs: {
		brief: "List all tasks",
	},
})
