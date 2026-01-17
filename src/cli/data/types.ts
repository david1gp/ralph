import type { InferOutput } from "valibot"
import { storySchema, taskSchema } from "@/cli/data/schema"

export type Task = InferOutput<typeof taskSchema>
export type Story = InferOutput<typeof storySchema>
