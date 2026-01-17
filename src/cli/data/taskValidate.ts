import { array, literal, number, object, optional, parse, string, union } from "valibot"

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

export function taskValidate(input: unknown) {
	return parse(taskSchema, input)
}
