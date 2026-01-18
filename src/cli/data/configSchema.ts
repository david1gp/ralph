import { object, record, string, number, optional, boolean } from "valibot"

export const configSchema = object({
	tasksFile: string(),
	storiesFolder: string(),
	projectTaskPrefix: optional(record(string(), string()), {}),
	projectTaskIdNumber: optional(record(string(), number()), {}),
	testing: optional(boolean(), false),
})
