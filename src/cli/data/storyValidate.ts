import { storySchema } from "@/cli/data/storySchema"
import { parseJson, pipe, safeParse, string } from "valibot"

export { storySchema }

export function storyValidate(input: string) {
  const schema = pipe(string(), parseJson(), storySchema)
  return safeParse(schema, input)
}
