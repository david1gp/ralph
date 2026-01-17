import { buildCommand, type CommandContext } from "@stricli/core"
import { array, safeParse, string } from "valibot"
import { parseDateTime } from "@/cli/utils/dateTime"
import { taskUpdate } from "@/cli/core/taskUpdate"
import { storyPathGet } from "@/cli/core/storyPathGet"
import type { Task } from "@/cli/data/TaskType"

interface UpdateFlags {
	passes?: boolean
	start?: string
	end?: string
	note?: string
	title?: string
	description?: string
	acceptanceCriteria?: string
	priority?: number
	story?: string
}

export const taskUpdateCommand = buildCommand({
	func(this: CommandContext, flags: UpdateFlags, id: string) {
		const updates: Partial<Task> = {}
		if (flags.passes !== undefined) {
			updates.passes = flags.passes
		}
		if (flags.start !== undefined) {
			updates.startedAt = parseDateTime(flags.start)
		}
		if (flags.end !== undefined) {
			updates.endedAt = parseDateTime(flags.end)
		}
		if (flags.note !== undefined) {
			updates.note = flags.note
		}
		if (flags.title !== undefined) {
			updates.title = flags.title
		}
		if (flags.description !== undefined) {
			updates.description = flags.description
		}
		if (flags.acceptanceCriteria !== undefined) {
			const result = safeParse(array(string()), flags.acceptanceCriteria)
			if (!result.success) {
				throw new Error(`Invalid acceptance criteria format: "${flags.acceptanceCriteria}". Expected JSON array of strings.`)
			}
			updates.acceptanceCriteria = result.output
		}
		if (flags.priority !== undefined) {
			updates.priority = flags.priority
		}
		if (flags.story !== undefined) {
			updates.story = storyPathGet(flags.story)
		}
		const updated = taskUpdate(id, updates)
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
			title: {
				kind: "parsed",
				parse: String,
				optional: true,
				brief: "Set task title (use empty string to clear)",
			},
			description: {
				kind: "parsed",
				parse: String,
				optional: true,
				brief: "Set task description (use empty string to clear)",
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
		brief: "Update a task",
	},
})
