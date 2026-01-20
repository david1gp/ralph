import { array, number, object, optional, string } from "valibot"

export const taskSchema = object({
  // meta
  id: string(),
  projectPath: string(),
  story: string(),
  priority: number(),
  // data
  title: string(),
  description: string(),
  acceptanceCriteria: array(string()),
  // optional
  note: optional(string()),
  startedAt: optional(string()),
  completedAt: optional(string()),
  createdAt: optional(string()),
})
