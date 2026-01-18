import { buildCommand, type CommandContext } from "@stricli/core"
import { storyCreate } from "@/cli/core/storyCreate"

interface CreateFlags {
	filename: string
	content: string
}

export async function storyCreateFunc(this: CommandContext, flags: CreateFlags) {
	const result = await storyCreate(flags.filename, flags.content)
	if (!result.success) {
		console.error(JSON.stringify(result))
		process.exit(1)
	}
	this.process.stdout.write(result.data)
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
