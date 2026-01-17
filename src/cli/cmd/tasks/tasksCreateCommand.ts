import { buildCommand, type CommandContext } from "@stricli/core"
import { createTask } from "@/cli/core/createTask"
import { readTasks } from "@/cli/core/readTasks"
import type { Task } from "@/cli/data/TaskType"

export const tasksCreateCommand = buildCommand({
	func(this: CommandContext, _: {}, title: string) {
		const tasks = readTasks()
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
		const created = createTask(newTask)
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
