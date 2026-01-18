import { taskSchema } from "@/cli/data/taskSchema"
import { parse } from "valibot"

export { taskSchema }

export function taskValidate(input: unknown) {
  return parse(taskSchema, input)
}
