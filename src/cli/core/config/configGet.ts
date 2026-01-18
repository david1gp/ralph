import { getConfigPath } from "@/cli/core/config/configStore"
import { configSchema } from "@/cli/data/configSchema"
import type { ConfigType } from "@/cli/data/ConfigType"
import { dirname, join } from "node:path"
import { homedir } from "os"
import { parse } from "valibot"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"

function resolveConfigPaths(taskiDir: string, rawConfig: ConfigType) {
	return {
		...rawConfig,
		tasksFile: join(taskiDir, rawConfig.tasksFile),
		storiesFolder: join(taskiDir, rawConfig.storiesFolder),
	}
}

async function readConfigFromPath(taskiPath: string): PromiseResult<ConfigType> {
  const isDirectFilePath = taskiPath.endsWith("taski.json")
  const configPath = isDirectFilePath ? taskiPath : join(taskiPath, "taski.json")
  const taskiDir = isDirectFilePath ? dirname(taskiPath) : taskiPath

  const taskiFile = Bun.file(configPath)
  if (!(await taskiFile.exists())) {
    return createError("configGet", `Config file not found at ${configPath}`)
  }

  try {
    const rawConfig = await taskiFile.json()
    const validatedConfig = parse(configSchema, rawConfig)
    return createResult(resolveConfigPaths(taskiDir, validatedConfig))
  } catch {
    return createError("configGet", `Invalid configuration in ${configPath}`)
  }
}

export async function configGet(): PromiseResult<ConfigType> {
  const tried: string[] = []

  const overridePath = getConfigPath()
  if (overridePath !== null) {
    return readConfigFromPath(overridePath)
  }

  const currentDirConfig = join(process.cwd(), ".taski", "taski.json")
  tried.push(currentDirConfig)
  const currentDirResult = await readConfigFromPath(currentDirConfig)
  if (currentDirResult.success) {
    return currentDirResult
  }

  const homedirConfig = join(homedir(), ".config", "taski", "taski.json")
  tried.push(homedirConfig)
  const homedirResult = await readConfigFromPath(homedirConfig)
  if (homedirResult.success) {
    return homedirResult
  }

  return createError("configGet", `Config file not found, searched: ${tried.join(", ")}`)
}
