import type { taskSchema } from "@/ralph/data/taskSchema"
import type { InferOutput } from "valibot"

export type TaskType = InferOutput<typeof taskSchema>
