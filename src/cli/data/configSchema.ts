import { object, string } from "valibot"

export const configSchema = object({
	tasksFile: string(),
	storiesFolder: string(),
})
