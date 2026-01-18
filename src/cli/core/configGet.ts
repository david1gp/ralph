import { configSchema } from "@/cli/data/configSchema"
import { getConfigPath } from "@/cli/core/configStore"
import { createResult, createError, type PromiseResult } from "~utils/result/Result"
import { join, dirname } from "node:path"
import { homedir } from "os"
import { parse } from "valibot"

function resolveConfigPaths(taskiDir: string, rawConfig: { tasksFile: string; storiesFolder: string }) {
	return {
		tasksFile: join(taskiDir, rawConfig.tasksFile),
		storiesFolder: join(taskiDir, rawConfig.storiesFolder),
	}
}

async function readConfigFromPath(taskiPath: string): PromiseResult<{ tasksFile: string; storiesFolder: string }> {
	const isDirectFilePath = taskiPath.endsWith("taski.json")
	const configPath = isDirectFilePath ? taskiPath : join(taskiPath, "taski.json")
	const taskiDir = isDirectFilePath ? dirname(taskiPath) : taskiPath

	const taskiFile = Bun.file(configPath)
	if (!await taskiFile.exists()) {
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

export async function configGet(): PromiseResult<{ tasksFile: string; storiesFolder: string }> {
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
