import { storySchema } from "@/cli/data/storySchema"
import type { InferOutput } from "valibot"

export type StoryType = InferOutput<typeof storySchema>
