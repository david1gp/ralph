import type { InferOutput } from "valibot"
import { storySchema } from "@/cli/data/storySchema"

export type Story = InferOutput<typeof storySchema>
