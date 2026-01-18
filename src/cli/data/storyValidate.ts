import { storySchema } from "@/cli/data/storySchema"
import { parse } from "valibot"

export { storySchema }

export function storyValidate(input: unknown) {
  return parse(storySchema, input)
}
