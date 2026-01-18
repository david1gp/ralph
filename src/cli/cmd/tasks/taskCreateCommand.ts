import { configGet } from "@/cli/core/config/configGet"
import { configSave } from "@/cli/core/config/configSave"
import { storyPathGet } from "@/cli/core/stories/storyPathGet"
import { taskCreate } from "@/cli/core/tasks/taskCreate"
import { taskIdGenerate } from "@/cli/core/tasks/taskIdGenerate"
import { tasksRead } from "@/cli/core/tasks/tasksRead"
import type { TaskType } from "@/cli/data/TaskType"
import { parseDateTime } from "@/cli/utils/dateTime"
import { buildCommand, type CommandContext } from "@stricli/core"
import { array, safeParse, string } from "valibot"

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
	config?: string
}

export async function taskCreateFunc(this: CommandContext, flags: CreateFlags) {
	const configResult = await configGet()
	if (!configResult.success) {
		console.error(configResult)
		process.exit(1)
	}
	const config = configResult.data

	const tasksResult = await tasksRead(config)
	if (!tasksResult.success) {
		console.error(tasksResult)
		process.exit(1)
	}
	const tasks = tasksResult.data
	const maxPriority = tasks.length > 0 ? Math.max(...tasks.map((t) => t.priority)) : 0
	const parsed = JSON.parse(flags.acceptanceCriteria)
	const result = safeParse(array(string()), parsed)
	if (!result.success) {
		const errorResult = { success: false, op: "taskCreateCommand", errorMessage: `Invalid acceptance criteria format: "${flags.acceptanceCriteria}". Expected JSON array of strings.` }
		console.error(errorResult)
		process.exit(1)
	}
	const acceptanceCriteria = result.output
	const storyValue = flags.story.endsWith(".md") ? flags.story : `${flags.story}.md`
	const storyResult = await storyPathGet(config, storyValue)
	if (!storyResult.success) {
		console.error(storyResult)
		process.exit(1)
	}
	let startedAt: string | undefined
	if (flags.start !== undefined && flags.start !== "") {
		const startResult = parseDateTime(flags.start)
		if (!startResult) {
			const errorResult = { success: false, op: "taskCreateCommand", errorMessage: `Invalid start date format: "${flags.start}"` }
			console.error(errorResult)
			process.exit(1)
		}
		if (!startResult.success) {
			console.error(startResult)
			process.exit(1)
		}
		startedAt = startResult.data
	}

	let endedAt: string | undefined
	if (flags.end !== undefined && flags.end !== "") {
		const endResult = parseDateTime(flags.end)
		if (!endResult) {
			const errorResult = { success: false, op: "taskCreateCommand", errorMessage: `Invalid end date format: "${flags.end}"` }
			console.error(errorResult)
			process.exit(1)
		}
		if (!endResult.success) {
			console.error(endResult)
			process.exit(1)
		}
		endedAt = endResult.data
	}

	const { id, idNumber } = taskIdGenerate(config, flags.dir)

	const newTask: TaskType = {
		id: id,
		dir: flags.dir,
		title: flags.title,
		description: flags.description,
		acceptanceCriteria: acceptanceCriteria,
		priority: flags.priority ?? maxPriority + 1,
		passes: flags.passes ?? false,
		note: flags.note ?? "",
		startedAt,
		endedAt,
		story: storyResult.data,
		createdAt: new Date().toISOString(),
	}
	const createdResult = await taskCreate(config, newTask)
	if (!createdResult.success) {
		console.error(createdResult)
		process.exit(1)
	}

	config.projectTaskIdNumber = config.projectTaskIdNumber ?? {}
	config.projectTaskIdNumber[flags.dir] = idNumber + 1
	await configSave(config)

	this.process.stdout.write(createdResult.data.id)
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
			config: {
				kind: "parsed",
				parse: String,
				optional: true,
				brief: "Path to config file (directory with taski.json or direct path)",
			},
		},
	},
	docs: {
		brief: "Create a new task",
	},
})
