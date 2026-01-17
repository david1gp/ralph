import type { taskSchema } from "@/cli/data/taskSchema"
import type { InferOutput } from "valibot"

export type Task = InferOutput<typeof taskSchema>
