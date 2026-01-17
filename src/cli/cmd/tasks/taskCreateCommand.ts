import { buildCommand, type CommandContext } from "@stricli/core"
import { array, safeParse, string } from "valibot"
import { parseDateTime } from "@/cli/utils/dateTime"
import { taskCreate } from "@/cli/core/taskCreate"
import { tasksRead } from "@/cli/core/tasksRead"
import { storyPathGet } from "@/cli/core/storyPathGet"
import type { Task } from "@/cli/data/TaskType"

interface CreateFlags {
	title: string
	description: string
	acceptanceCriteria: string
	priority?: number
	passes?: boolean
	start?: string
	end?: string
	note?: string
	story: string
	dir: string
}

export function taskCreateFunc(this: CommandContext, flags: CreateFlags) {
	const tasks = tasksRead()
	const maxPriority = tasks.length > 0 ? Math.max(...tasks.map((t) => t.priority)) : 0
	const parsed = JSON.parse(flags.acceptanceCriteria)
	const result = safeParse(array(string()), parsed)
	if (!result.success) {
		throw new Error(`Invalid acceptance criteria format: "${flags.acceptanceCriteria}". Expected JSON array of strings.`)
	}
	const acceptanceCriteria = result.output
	const storyValue = flags.story.endsWith(".md") ? flags.story : `${flags.story}.md`
	const newTask: Task = {
		id: `T-${String(tasks.length + 1).padStart(3, "0")}`,
		dir: flags.dir,
		title: flags.title,
		description: flags.description,
		acceptanceCriteria: acceptanceCriteria,
		priority: flags.priority ?? maxPriority + 1,
		passes: flags.passes ?? false,
		note: flags.note ?? "",
		startedAt: flags.start !== undefined ? parseDateTime(flags.start) : undefined,
		endedAt: flags.end !== undefined ? parseDateTime(flags.end) : undefined,
		story: storyPathGet(storyValue),
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
				optional: false,
				brief: "Set task description",
			},
			acceptanceCriteria: {
				kind: "parsed",
				parse: String,
				optional: false,
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
				optional: false,
				brief: "Set story reference (filename or path, .md extension optional)",
			},
			dir: {
				kind: "parsed",
				parse: String,
				optional: false,
				brief: "Set task directory path",
			},
		},
	},
	docs: {
		brief: "Create a new task",
	},
})
