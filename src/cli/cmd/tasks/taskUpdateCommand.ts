import { buildCommand, type CommandContext } from "@stricli/core"
import { safeParse } from "valibot"
import { dateTimeSchema } from "~utils/valibot/dateTimeSchema"
import { taskUpdate } from "@/cli/core/taskUpdate"
import type { Task } from "@/cli/data/TaskType"

interface UpdateFlags {
	passes?: boolean
	start?: string
	end?: string
	note?: string
}

function parseDateTime(value: string): string | undefined {
	if (value === "now") {
		return new Date().toISOString()
	}
	if (value === "") {
		return undefined
	}
	const result = safeParse(dateTimeSchema, value)
	if (!result.success) {
		throw new Error(`Invalid date-time format: "${value}". Use ISO 8601 format or "now".`)
	}
	return result.output
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
		},
	},
	docs: {
		brief: "Update a task",
	},
})
