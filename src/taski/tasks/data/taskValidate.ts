import { parseJson, pipe, safeParse, string } from "valibot"
import { taskSchema } from "@/taski/tasks/data/taskSchema"

export { taskSchema }

export function taskValidate(input: string) {
  const schema = pipe(string(), parseJson(), taskSchema)
  return safeParse(schema, input)
}
