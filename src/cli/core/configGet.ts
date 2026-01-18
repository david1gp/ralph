import { ConfigNotFoundError, ConfigValidationError } from "@/cli/core/configError"
import { configSchema } from "@/cli/data/configSchema"
import { join } from "node:path"
import { parse } from "valibot"

const homeDir = process.env.HOME || ""

function resolveConfigPaths(taskiDir: string, rawConfig: { tasksFile: string; storiesFolder: string }) {
	return {
		tasksFile: join(taskiDir, rawConfig.tasksFile),
		storiesFolder: join(taskiDir, rawConfig.storiesFolder),
	}
}

export async function configGet(): Promise<{ tasksFile: string; storiesFolder: string }> {
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
				return resolveConfigPaths(taskiDir, validatedConfig)
			} catch {
				throw new ConfigValidationError(`Invalid configuration in ${taskiPath}`)
			}
		}

		const parentDir = join(currentDir, "..")
		if (currentDir === "/" || (homeDir && currentDir === homeDir)) {
			throw new ConfigNotFoundError(tried, currentDir)
		}
		currentDir = parentDir
	}
}
