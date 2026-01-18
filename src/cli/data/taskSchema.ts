import { array, literal, number, object, optional, string, union } from "valibot"

export const taskSchema = object({
  // meta
	id: string(),
	dir: string(),
	story: string(),
	priority: number(),
	passes: union([literal(true), literal(false)]),
  // data
	title: string(),
	description: string(),
	acceptanceCriteria: array(string()),
	// optional
	note: optional(string()),
	startedAt: optional(string()),
	endedAt: optional(string()),
	createdAt: optional(string()),
})
