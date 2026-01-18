import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"
import type { TaskType } from "@/cli/data/TaskType"
import { taskSchema } from "@/cli/data/taskSchema"
import { safeParse } from "valibot"

export function taskParse(data: unknown): { success: true; data: TaskType } | { success: false; issues: string } {
	const result = safeParse(taskSchema, data)
	if (result.success) {
		return { success: true, data: result.output }
	}
	return { success: false, issues: jsonStringifyPretty(result.issues) }
}
