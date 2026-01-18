import { configLoad } from "@/cli/core/config/configLoad"
import { storyPathGet } from "@/cli/core/stories/storyPathGet"
import { taskUpdate } from "@/cli/core/tasks/taskUpdate"
import type { TaskType } from "@/cli/data/TaskType"
import { parseDateTime } from "@/cli/utils/dateTime"
import { buildCommand, type CommandContext } from "@stricli/core"
import { array, safeParse, string } from "valibot"

interface UpdateFlags {
	passes?: boolean
	start?: string
	end?: string
	created?: string
	note?: string
	title?: string
	description?: string
	acceptanceCriteria?: string
	priority?: number
	story?: string
	config?: string
}

export const taskUpdateCommand = buildCommand({
	async func(this: CommandContext, flags: UpdateFlags, id: string) {
		const configResult = await configLoad(flags.config)
		if (!configResult.success) {
			console.error(configResult)
			process.exit(1)
		}
		const config = configResult.data

		const updates: Partial<TaskType> = {}
		if (flags.passes !== undefined) {
			updates.passes = flags.passes
		}
		if (flags.start !== undefined) {
			const startResult = parseDateTime(flags.start)
			if (startResult && !startResult.success) {
				console.error(JSON.stringify(startResult))
				process.exit(1)
			}
			updates.startedAt = startResult?.data
		}
		if (flags.end !== undefined) {
			const endResult = parseDateTime(flags.end)
			if (endResult && !endResult.success) {
				console.error(JSON.stringify(endResult))
				process.exit(1)
			}
			updates.endedAt = endResult?.data
		}
		if (flags.created !== undefined) {
			const createdResult = parseDateTime(flags.created)
			if (createdResult && !createdResult.success) {
				console.error(JSON.stringify(createdResult))
				process.exit(1)
			}
			updates.createdAt = createdResult?.data
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
				const errorResult = { success: false, op: "taskUpdateCommand", errorMessage: `Invalid acceptance criteria format: "${flags.acceptanceCriteria}". Expected JSON array of strings.` }
				console.error(JSON.stringify(errorResult))
				process.exit(1)
			}
			updates.acceptanceCriteria = result.output
		}
		if (flags.priority !== undefined) {
			updates.priority = flags.priority
		}
		if (flags.story !== undefined) {
			const storyResult = await storyPathGet(config, flags.story)
			if (!storyResult.success) {
				console.error(JSON.stringify(storyResult))
				process.exit(1)
			}
			updates.story = storyResult.data
		}
		const updatedResult = await taskUpdate(config, id, updates)
		if (!updatedResult.success) {
			console.error(JSON.stringify(updatedResult))
			process.exit(1)
		}
		const updated = updatedResult.data
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
			created: {
				kind: "parsed",
				parse: String,
				optional: true,
				inferEmpty: true,
				brief: "Set createdAt (use 'now', empty to clear, or ISO 8601 timestamp)",
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
			config: {
				kind: "parsed",
				parse: String,
				optional: true,
				brief: "Path to config file (directory with taski.json or direct path)",
			},
		},
	},
	docs: {
		brief: "Update a task",
	},
})
