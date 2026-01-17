import { array, object, string } from "valibot"

export const storySchema = object({
	title: string(),
	introduction: string(),
	goals: array(string()),
	userTasks: array(string()),
})
