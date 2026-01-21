import { configSchema } from "@/taski/config/configSchema"
import type { ConfigType } from "@/taski/config/ConfigType"
import { dirname, join } from "node:path"
import { homedir } from "os"
import { parseJson, pipe, safeParse, string, summarize } from "valibot"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"

export async function configLoad(configPath?: string): PromiseResult<ConfigType> {
  const triedPaths: string[] = []

  if (configPath) {
    return readConfigFromPath(configPath)
  }

  const cwdConfig = join(process.cwd(), ".taski", "taski.json")
  triedPaths.push(cwdConfig)
  const cwdResult = await readConfigFromPath(cwdConfig)
  if (cwdResult.success) {
    return cwdResult
  }

  let currentDir = process.cwd()
  const root = "/"
  const home = homedir()

  while (currentDir !== home && currentDir !== root) {
    const parentConfig = join(currentDir, ".taski", "taski.json")
    triedPaths.push(parentConfig)
    const result = await readConfigFromPath(parentConfig)
    if (result.success) {
      return result
    }
    currentDir = dirname(currentDir)
  }

  const homedirConfig = join(homedir(), ".config", "taski", "taski.json")
  triedPaths.push(homedirConfig)
  const homedirResult = await readConfigFromPath(homedirConfig)
  if (homedirResult.success) {
    return homedirResult
  }

  return createError("configLoad", `Config file not found`, JSON.stringify(triedPaths))
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
