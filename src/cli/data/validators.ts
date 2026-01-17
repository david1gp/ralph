import { safeParse } from "valibot"
import type { Task, Story } from "@/cli/data/types"
import { taskSchema, storySchema } from "@/cli/data/schema"

export function parseTask(data: unknown): { success: true; data: Task } | { success: false; issues: string } {
	const result = safeParse(taskSchema, data)
	if (result.success) {
		return { success: true, data: result.output }
	}
	return { success: false, issues: JSON.stringify(result.issues) }
}

export function parseStory(data: unknown): { success: true; data: Story } | { success: false; issues: string } {
	const result = safeParse(storySchema, data)
	if (result.success) {
		return { success: true, data: result.output }
	}
	return { success: false, issues: JSON.stringify(result.issues) }
}
