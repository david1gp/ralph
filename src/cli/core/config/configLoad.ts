import { configSchema } from "@/cli/data/configSchema"
import type { ConfigType } from "@/cli/data/ConfigType"
import { dirname, join } from "node:path"
import { homedir } from "os"
import { parseJson, pipe, safeParse, string, summarize } from "valibot"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"

export async function configLoad(configPath?: string): PromiseResult<ConfigType> {
  if (configPath) {
    return readConfigFromPath(configPath)
  }

  const currentDirConfig = join(process.cwd(), ".taski", "taski.json")
  const currentDirResult = await readConfigFromPath(currentDirConfig)
  if (currentDirResult.success) {
    return currentDirResult
  }

  const homedirConfig = join(homedir(), ".config", "taski", "taski.json")
  return readConfigFromPath(homedirConfig)
}

async function readConfigFromPath(taskiPath: string): PromiseResult<ConfigType> {
  const isDirectFilePath = taskiPath.endsWith("taski.json")
  const configPath = isDirectFilePath ? taskiPath : join(taskiPath, "taski.json")
  const taskiDir = isDirectFilePath ? dirname(taskiPath) : taskiPath

  const taskiFile = Bun.file(configPath)
  if (!(await taskiFile.exists())) {
    return createError("configLoad", `Config file not found at ${configPath}`)
  }

  try {
    const rawConfig = await taskiFile.text()
    const result = safeParse(pipe(string(), parseJson(), configSchema), rawConfig)
    if (!result.success) {
      return createError("configLoad", summarize(result.issues))
    }

    const isTestConfig = taskiPath.includes("/test/.taski/")
    if (isTestConfig && !result.output.testing) {
      return createError("configLoad", `Test config at ${configPath} must have 'testing: true'`)
    }

    return createResult(resolveConfigPaths(taskiDir, result.output))
  } catch {
    return createError("configLoad", `Invalid configuration in ${configPath}`)
  }
}

function resolveConfigPaths(taskiDir: string, rawConfig: ConfigType) {
  return {
    ...rawConfig,
    tasksFile: join(taskiDir, rawConfig.tasksFile),
    tasksArchivedDir: join(taskiDir, rawConfig.tasksArchivedDir),
    storiesFolder: join(taskiDir, rawConfig.storiesFolder),
  }
}
