import type { StoryType } from "@/cli/data/StoryType";
import { storySchema } from "@/cli/data/storySchema";
import { safeParse } from "valibot";

export function storyParse(data: unknown): { success: true; data: StoryType } | { success: false; issues: string } {
	const result = safeParse(storySchema, data)
	if (result.success) {
		return { success: true, data: result.output }
	}
	return { success: false, issues: JSON.stringify(result.issues) }
}
