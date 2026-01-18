import { buildCommand, type CommandContext } from "@stricli/core"
import { taskFindNext } from "@/cli/core/taskFindNext"
import { configLoad } from "@/cli/core/configLoad"

interface NextFlags {
	config?: string
}

export const taskNextCommand = buildCommand({
	async func(this: CommandContext, flags: NextFlags) {
		const configResult = await configLoad(flags.config)
		if (!configResult.success) {
			console.error(JSON.stringify(configResult))
			process.exit(1)
		}
		const config = configResult.data

		const next = await taskFindNext(config)
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
		brief: "Show next pending task",
	},
})
