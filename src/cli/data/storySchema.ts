import { array, object, parse, string } from "valibot"

export const storySchema = object({
	title: string(),
	introduction: string(),
	goals: array(string()),
	userTasks: array(string()),
})

export function validateStory(input: unknown) {
	return parse(storySchema, input)
}
