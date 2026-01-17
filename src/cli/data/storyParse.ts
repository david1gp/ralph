import { safeParse } from "valibot"
import type { Story } from "@/cli/data/StoryType"
import { storySchema } from "@/cli/data/storyValidate"

export function storyParse(data: unknown): { success: true; data: Story } | { success: false; issues: string } {
	const result = safeParse(storySchema, data)
	if (result.success) {
		return { success: true, data: result.output }
	}
	return { success: false, issues: JSON.stringify(result.issues) }
}
