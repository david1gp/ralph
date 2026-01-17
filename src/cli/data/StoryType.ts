import type { InferOutput } from "valibot"
import { storySchema } from "@/cli/data/storyValidate"

export type Story = InferOutput<typeof storySchema>
