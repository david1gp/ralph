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

export const storySchema = object({
	title: string(),
	introduction: string(),
	goals: array(string()),
	userTasks: array(string()),
})

export function validateTask(input: unknown) {
	return parse(taskSchema, input)
}

export function validateStory(input: unknown) {
	return parse(storySchema, input)
}
