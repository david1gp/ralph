import { buildCommand, type CommandContext } from "@stricli/core"
import { updateTask } from "@/cli/core/updateTask"
import type { Task } from "@/cli/data/TaskType"

interface UpdateFlags {
	passes?: boolean
}

export const tasksUpdateCommand = buildCommand({
	func(this: CommandContext, flags: UpdateFlags, id: string) {
		const updates: Partial<Task> = {}
		if (flags.passes !== undefined) {
			updates.passes = flags.passes
		}
		const updated = updateTask(id, updates)
		this.process.stdout.write(`Task "${updated.id}" updated successfully`)
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
		flags: {
			passes: {
				kind: "boolean",
				optional: true,
				brief: "Mark task as passing",
			},
		},
	},
	docs: {
		brief: "Update a task",
	},
})
