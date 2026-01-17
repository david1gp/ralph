import { buildCommand, type CommandContext } from "@stricli/core"
import { storyCreate } from "@/cli/core/storyCreate"

interface CreateFlags {
	filename: string
	content: string
}

export function storyCreateFunc(this: CommandContext, flags: CreateFlags) {
	const filePath = storyCreate(flags.filename, flags.content)
	this.process.stdout.write(filePath)
}

export const storyCreateCommand = buildCommand({
	func: storyCreateFunc,
	parameters: {
		flags: {
			filename: {
				kind: "parsed",
				parse: String,
				optional: false,
				brief: "Story filename",
			},
			content: {
				kind: "parsed",
				parse: String,
				optional: false,
				brief: "Story content",
			},
		},
	},
	docs: {
		brief: "Create a new story",
	},
})
