import { array, literal, number, object, optional, string, union } from "valibot"

export const taskSchema = object({
	id: string(),
	dir: string(),
	title: string(),
	description: string(),
	acceptanceCriteria: array(string()),
	priority: number(),
	passes: union([literal(true), literal(false)]),
	notes: optional(string()),
})
