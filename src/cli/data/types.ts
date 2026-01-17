import type { InferOutput } from "valibot"
import { storySchema, taskSchema } from "./schema.js"

export type Task = InferOutput<typeof taskSchema>
export type Story = InferOutput<typeof storySchema>
