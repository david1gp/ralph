import { parseJson, pipe, safeParse, string } from "valibot"
import { storySchema } from "@/taski/stories/data/storySchema"

export { storySchema }

export function storyValidate(input: string) {
  const schema = pipe(string(), parseJson(), storySchema)
  return safeParse(schema, input)
}
