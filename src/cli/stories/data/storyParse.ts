import type { StoryType } from "@/cli/stories/data/StoryType"
import { storySchema } from "@/cli/stories/data/storySchema"
import { safeParse } from "valibot"
import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"

export function storyParse(data: unknown): { success: true; data: StoryType } | { success: false; issues: string } {
  const result = safeParse(storySchema, data)
  if (result.success) {
    return { success: true, data: result.output }
  }
  return { success: false, issues: jsonStringifyPretty(result.issues) }
}
