import { buildCommand, type CommandContext } from "@stricli/core"
import { storyUpdate } from "@/cli/core/storyUpdate"

interface UpdateFlags {
	title?: string
	description?: string
	goals?: string
	userTasks?: string
}

function parseArray(value: string | undefined): Array<string> | undefined {
	if (value === undefined || value === "") {
		return undefined
	}
	return value.split(",").map((item) => item.trim()).filter((item) => item !== "")
}

export const storyUpdateCommand = buildCommand({
	async func(this: CommandContext, flags: UpdateFlags, filename: string) {
		const updates: Record<string, unknown> = {}
		if (flags.title !== undefined) {
			updates.title = flags.title
		}
		if (flags.description !== undefined) {
			updates.description = flags.description
		}
		if (flags.goals !== undefined) {
			updates.goals = parseArray(flags.goals)
		}
		if (flags.userTasks !== undefined) {
			updates.userTasks = parseArray(flags.userTasks)
		}
		const updatedResult = await storyUpdate(filename, updates as Parameters<typeof storyUpdate>[1])
		if (!updatedResult.success) {
			console.error(JSON.stringify(updatedResult))
			process.exit(1)
		}
		const updated = updatedResult.data
		this.process.stdout.write(`Story "${updated.title}" updated successfully`)
	},
	parameters: {
		positional: {
			kind: "tuple",
			parameters: [
				{
					brief: "Story filename",
					parse: String,
					placeholder: "filename",
				},
			],
		},
		flags: {
			title: {
				kind: "parsed",
				parse: String,
				optional: true,
				brief: "Set story title",
			},
			description: {
				kind: "parsed",
				parse: String,
				optional: true,
				brief: "Set story description",
			},
			goals: {
				kind: "parsed",
				parse: String,
				optional: true,
				brief: "Set story goals (comma-separated)",
			},
			userTasks: {
				kind: "parsed",
				parse: String,
				optional: true,
				brief: "Set story user tasks (comma-separated)",
			},
		},
	},
	docs: {
		brief: "Update a story",
	},
})
