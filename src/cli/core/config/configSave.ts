import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"
import { configSchema } from "@/cli/data/configSchema"
import type { ConfigType } from "@/cli/data/ConfigType"
import { dirname, join, relative } from "node:path"
import { safeParse, summarize } from "valibot"
import { createError, type PromiseResult } from "~utils/result/Result"

export async function configSave(config: ConfigType): PromiseResult<void> {
  const taskiDir = dirname(config.tasksFile)
  const rawConfig = {
    tasksFile: relative(taskiDir, config.tasksFile),
    storiesFolder: relative(taskiDir, config.storiesFolder),
    projectTaskPrefix: config.projectTaskPrefix ?? {},
    projectTaskIdNumber: config.projectTaskIdNumber ?? {},
    storyIdNumber: config.storyIdNumber ?? 1,
    projectStoryIdNumber: config.projectStoryIdNumber ?? {},
  }
  const result = safeParse(configSchema, rawConfig)
  if (!result.success) {
    return createError("configSave", summarize(result.issues))
  }
  const validatedConfig = result.output
  const configPath = join(taskiDir, "taski.json")
  const taskiFile = Bun.file(configPath)
  await taskiFile.write(jsonStringifyPretty(validatedConfig))
  return { success: true } as { success: true; data: void }
}
