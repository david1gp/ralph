import { taskSchema } from "@/cli/data/taskSchema"
import { parse } from "valibot"

export function taskValidate(input: unknown) {
  return parse(taskSchema, input)
}
