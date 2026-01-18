import { array, object, optional, string } from "valibot"

export const storySchema = object({
  title: string(),
  description: string(),
  goals: array(string()),
  userTasks: array(string()),
  projectDir: optional(string()),
})
