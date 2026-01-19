import { taskSchema } from "@/cli/tasks/data/taskSchema"
import { parseJson, pipe, safeParse, string } from "valibot"

export { taskSchema }

export function taskValidate(input: string) {
  const schema = pipe(string(), parseJson(), taskSchema)
  return safeParse(schema, input)
}
