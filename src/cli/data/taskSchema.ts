import { array, literal, number, object, optional, string, union } from "valibot"

export const taskSchema = object({
	id: string(),
	dir: string(),
	title: string(),
	description: string(),
	acceptanceCriteria: array(string()),
	priority: number(),
	passes: union([literal(true), literal(false)]),
	note: optional(string()),
	startedAt: optional(string()),
	endedAt: optional(string()),
	story: optional(string()),
})
