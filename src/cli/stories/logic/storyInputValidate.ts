import { stat } from "node:fs/promises"
import type { PromiseResult, Result } from "~utils/result/Result"

export interface StoryTitleResult {
  success: boolean
  formatted?: string
  error?: string
}

export function shortStoryTitleFormat(title: string): Result<string> {
  const allowedPattern = /^[a-zA-Z0-9 _\-]+$/
  if (!allowedPattern.test(title)) {
    return {
      op: "shortStoryTitleFormat",
      success: false,
      errorMessage:
        "Title contains invalid characters. Only alphanumeric, spaces, underscores, and dashes are allowed.",
      errorData: title,
    }
  }
  const formatted = title.replace(/[ _]/g, "-")
  return { success: true, data: formatted }
}

export async function projectPathExists(projectPath: string): PromiseResult<boolean> {
  const op = "projectPathExists"
  try {
    const stats = await stat(projectPath)
    if (!stats.isDirectory()) {
      return {
        op,
        success: false,
        errorMessage: "Path is not a directory",
        errorData: projectPath,
      }
    }
    return { success: true, data: true }
  } catch {
    return { op, success: false, errorMessage: "Directory does not exist", errorData: projectPath }
  }
}
