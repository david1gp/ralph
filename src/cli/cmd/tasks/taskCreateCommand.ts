import { buildCommand, type CommandContext } from "@stricli/core"
import { array, safeParse, string } from "valibot"
import { parseDateTime } from "@/cli/utils/dateTime"
import { taskCreate } from "@/cli/core/taskCreate"
import { tasksRead } from "@/cli/core/tasksRead"
import { storyPathGet } from "@/cli/core/storyPathGet"
import type { Task } from "@/cli/data/TaskType"

interface CreateFlags {
	title: string
	description?: string
	acceptanceCriteria?: string
	priority?: number
	passes?: boolean
	start?: string
	end?: string
	note?: string
	story?: string
}

export function taskCreateFunc(this: CommandContext, flags: CreateFlags) {
	const tasks = tasksRead()
	const maxPriority = tasks.length > 0 ? Math.max(...tasks.map((t) => t.priority)) : 0
	let acceptanceCriteria: string[] = []
	if (flags.acceptanceCriteria !== undefined) {
		const parsed = JSON.parse(flags.acceptanceCriteria)
		const result = safeParse(array(string()), parsed)
		if (!result.success) {
			throw new Error(`Invalid acceptance criteria format: "${flags.acceptanceCriteria}". Expected JSON array of strings.`)
		}
		acceptanceCriteria = result.output
	}
	const newTask: Task = {
		id: `T-${String(tasks.length + 1).padStart(3, "0")}`,
		dir: "/home/david/Coding/personal-taski-cli",
		title: flags.title,
		description: flags.description ?? "",
		acceptanceCriteria: acceptanceCriteria,
		priority: flags.priority ?? maxPriority + 1,
		passes: flags.passes ?? false,
		note: flags.note ?? "",
		startedAt: flags.start !== undefined ? parseDateTime(flags.start) : undefined,
		endedAt: flags.end !== undefined ? parseDateTime(flags.end) : undefined,
		story: flags.story !== undefined ? storyPathGet(flags.story) : undefined,
	}
	const created = taskCreate(newTask)
	this.process.stdout.write(`Task "${created.id}" created successfully`)
}

export const taskCreateCommand = buildCommand({
	func: taskCreateFunc,
	parameters: {
		flags: {
			title: {
				kind: "parsed",
				parse: String,
				optional: false,
				brief: "Set task title",
			},
			description: {
				kind: "parsed",
				parse: String,
				optional: true,
				brief: "Set task description",
			},
			acceptanceCriteria: {
				kind: "parsed",
				parse: String,
				optional: true,
				brief: "Set acceptance criteria (JSON array string, e.g. '[\"Test 1\"]')",
			},
			priority: {
				kind: "parsed",
				parse: Number,
				optional: true,
				brief: "Set task priority (number)",
			},
			passes: {
				kind: "boolean",
				optional: true,
				brief: "Mark task as passing",
			},
			start: {
				kind: "parsed",
				parse: String,
				optional: true,
				inferEmpty: true,
				brief: "Set startedAt (use 'now', empty to clear, or ISO 8601 timestamp)",
			},
			end: {
				kind: "parsed",
				parse: String,
				optional: true,
				inferEmpty: true,
				brief: "Set endedAt (use 'now', empty to clear, or ISO 8601 timestamp)",
			},
			note: {
				kind: "parsed",
				parse: String,
				optional: true,
				brief: "Set note field",
			},
			story: {
				kind: "parsed",
				parse: String,
				optional: true,
				inferEmpty: true,
				brief: "Set story reference (filename or path, empty to clear)",
			},
		},
	},
	docs: {
		brief: "Create a new task",
	},
})
