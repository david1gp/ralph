import type { InferOutput } from "valibot"
import type { taskSchema } from "@/taski/tasks/data/taskSchema"

export type TaskType = InferOutput<typeof taskSchema>
