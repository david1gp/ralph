import type { InferOutput } from "valibot"
import { taskSchema } from "@/cli/data/taskSchema"

export type Task = InferOutput<typeof taskSchema>
