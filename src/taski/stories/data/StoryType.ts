import type { InferOutput } from "valibot"
import type { storySchema } from "@/taski/stories/data/storySchema"

export type StoryType = InferOutput<typeof storySchema>
