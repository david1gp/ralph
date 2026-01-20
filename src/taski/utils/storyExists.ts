import type { ConfigType } from "@/taski/config/ConfigType"
import { storyPathGet } from "@/taski/stories/logic/storyPathGet"
import { existsSync } from "node:fs"
import { createError, type PromiseResult } from "~utils/result/Result"

export async function storyExists(config: ConfigType, storyValue: string): PromiseResult<string> {
  if (storyValue === "") {
    return storyPathGet(config, storyValue)
  }
  const storyWithExt = storyValue.endsWith(".md") ? storyValue : `${storyValue}.md`
  const pathResult = await storyPathGet(config, storyWithExt)
  if (!pathResult.success) {
    return pathResult
  }
  if (!existsSync(pathResult.data)) {
    return createError("storyExists", `Story "${storyWithExt}" not found at "${pathResult.data}"`)
  }
  return pathResult
}
