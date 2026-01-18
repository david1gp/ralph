import { configSchema } from "@/cli/data/configSchema"
import { getConfigPath } from "@/cli/core/configStore"
import { createResult, createError, type PromiseResult } from "~utils/result/Result"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { parse } from "valibot"

const homeDir = process.env.HOME || ""

function resolveConfigPaths(taskiDir: string, rawConfig: { tasksFile: string; storiesFolder: string }) {
	return {
		tasksFile: join(taskiDir, rawConfig.tasksFile),
		storiesFolder: join(taskiDir, rawConfig.storiesFolder),
	}
}

async function readConfigFromPath(taskiDir: string): PromiseResult<{ tasksFile: string; storiesFolder: string }> {
	const taskiPath = join(taskiDir, "taski.json")
	const taskiFile = Bun.file(taskiPath)

	if (!await taskiFile.exists()) {
		return createError("configGet", `Config file not found at ${taskiPath}`)
	}

	try {
		const rawConfig = await taskiFile.json()
		const validatedConfig = parse(configSchema, rawConfig)
		return createResult(resolveConfigPaths(taskiDir, validatedConfig))
	} catch {
		return createError("configGet", `Invalid configuration in ${taskiPath}`)
	}
}

export async function configGet(): PromiseResult<{ tasksFile: string; storiesFolder: string }> {
	const overridePath = getConfigPath()
	if (overridePath !== null) {
		return readConfigFromPath(overridePath)
	}

	let currentDir = process.cwd()
	const tried: string[] = []

	while (true) {
		const taskiPath = join(currentDir, ".taski", "taski.json")
		tried.push(taskiPath)

		const taskiDir = join(currentDir, ".taski")
		const taskiFile = Bun.file(taskiPath)

		if (await taskiFile.exists()) {
			try {
				const rawConfig = await taskiFile.json()
				const validatedConfig = parse(configSchema, rawConfig)
				return createResult(resolveConfigPaths(taskiDir, validatedConfig))
			} catch {
				return createError("configGet", `Invalid configuration in ${taskiPath}`)
			}
		}

		const parentDir = join(currentDir, "..")
		if (currentDir === "/" || (homeDir && currentDir === homeDir)) {
			return createError("configGet", `.taski directory not found, searched: ${tried.join(", ")}`)
		}
		currentDir = parentDir
	}
}
