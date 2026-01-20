import { taskSchema } from "@/ralph/data/taskSchema"
import type { TaskType } from "@/ralph/data/TaskType"
import { safeParse } from "valibot"

export function taskParse(data: unknown): { success: true; data: TaskType } | { success: false; issues: string } {
	const result = safeParse(taskSchema, data)
	if (result.success) {
		return { success: true, data: result.output }
	}
	return { success: false, issues: JSON.stringify(result.issues) }
}
