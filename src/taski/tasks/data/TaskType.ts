import type { taskSchema } from "@/taski/tasks/data/taskSchema"
import type { InferOutput } from "valibot"

export type TaskType = InferOutput<typeof taskSchema>
