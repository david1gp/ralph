import type { taskSchema } from "@/cli/tasks/data/taskSchema"
import type { InferOutput } from "valibot"

export type TaskType = InferOutput<typeof taskSchema>
