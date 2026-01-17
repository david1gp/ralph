import { buildCommand, type CommandContext } from "@stricli/core"
import { storyUpdate } from "@/cli/core/storyUpdate"

interface UpdateFlags {
	title?: string
	introduction?: string
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
	func(this: CommandContext, flags: UpdateFlags, filename: string) {
		const updates: Record<string, unknown> = {}
		if (flags.title !== undefined) {
			updates.title = flags.title
		}
		if (flags.introduction !== undefined) {
			updates.introduction = flags.introduction
		}
		if (flags.goals !== undefined) {
			updates.goals = parseArray(flags.goals)
		}
		if (flags.userTasks !== undefined) {
			updates.userTasks = parseArray(flags.userTasks)
		}
		const updated = storyUpdate(filename, updates as Parameters<typeof storyUpdate>[1])
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
			introduction: {
				kind: "parsed",
				parse: String,
				optional: true,
				brief: "Set story introduction",
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
