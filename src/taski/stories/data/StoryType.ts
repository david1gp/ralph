import { storySchema } from "@/taski/stories/data/storySchema"
import type { InferOutput } from "valibot"

export type StoryType = InferOutput<typeof storySchema>
