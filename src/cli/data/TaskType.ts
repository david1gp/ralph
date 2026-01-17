import type { InferOutput } from "valibot"
import { taskSchema } from "@/cli/data/taskValidate"

export type Task = InferOutput<typeof taskSchema>
