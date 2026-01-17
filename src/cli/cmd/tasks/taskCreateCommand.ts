import { buildCommand, type CommandContext } from "@stricli/core"
import { taskCreate } from "@/cli/core/taskCreate"
import { tasksRead } from "@/cli/core/tasksRead"
import type { Task } from "@/cli/data/TaskType"

export const taskCreateCommand = buildCommand({
	func(this: CommandContext, _: {}, title: string) {
		const tasks = tasksRead()
		const maxPriority = Math.max(...tasks.map((t) => t.priority))
		const newTask: Task = {
			id: `T-${String(tasks.length + 1).padStart(3, "0")}`,
			dir: "/home/david/Coding/personal-taski-cli",
			title: title,
			description: "",
			acceptanceCriteria: [],
			priority: maxPriority + 1,
			passes: false,
			notes: "",
		}
		const created = taskCreate(newTask)
		this.process.stdout.write(`Task "${created.id}" created successfully`)
	},
	parameters: {
		positional: {
			kind: "tuple",
			parameters: [
				{
					brief: "Task title",
					parse: String,
					placeholder: "title",
				},
			],
		},
	},
	docs: {
		brief: "Create a new task",
	},
})
