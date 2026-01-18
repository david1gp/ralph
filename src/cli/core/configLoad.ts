import { configSchema } from "@/cli/data/configSchema"
import type { ConfigType } from "@/cli/data/ConfigType"
import { dirname, join } from "node:path"
import { homedir } from "os"
import { parse } from "valibot"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"

function resolveConfigPaths(taskiDir: string, rawConfig: ConfigType) {
	return {
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
		return createError("configLoad", `Config file not found at ${configPath}`)
	}

	try {
		const rawConfig = await taskiFile.json()
		const validatedConfig = parse(configSchema, rawConfig)
		return createResult(resolveConfigPaths(taskiDir, validatedConfig))
	} catch {
		return createError("configLoad", `Invalid configuration in ${configPath}`)
	}
}

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
