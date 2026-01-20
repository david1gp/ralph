import type { ConfigType } from "@/taski/config/ConfigType"
import { basename } from "node:path"

export interface StoryIdResult {
  globalId: number
  globalIdFormatted: string
  projectId: number
  projectIdFormatted: string
  abbr: string
}

export function storyIdGenerate(config: ConfigType, dir: string): StoryIdResult {
  const abbr = config.projectTaskPrefix?.[dir] ?? basename(dir)
  const globalId = config.storyIdNumber ?? 1
  const projectId = config.projectStoryIdNumber?.[dir] ?? 1
  const globalIdFormatted = "S-".concat(String(globalId).padStart(3, "0"))
  const projectIdFormatted = String(projectId).padStart(3, "0")
  return { globalId, globalIdFormatted, projectId, projectIdFormatted, abbr }
}
