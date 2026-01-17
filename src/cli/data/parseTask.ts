import { safeParse } from "valibot"
import type { Task } from "@/cli/data/TaskType"
import { taskSchema } from "@/cli/data/taskSchema"

export function parseTask(data: unknown): { success: true; data: Task } | { success: false; issues: string } {
	const result = safeParse(taskSchema, data)
	if (result.success) {
		return { success: true, data: result.output }
	}
	return { success: false, issues: JSON.stringify(result.issues) }
}
