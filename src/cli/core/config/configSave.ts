import { configSchema } from "@/cli/data/configSchema"
import type { ConfigType } from "@/cli/data/ConfigType"
import { dirname, join, relative } from "node:path"
import { parse } from "valibot"

export async function configSave(config: ConfigType): Promise<void> {
	const taskiDir = dirname(config.tasksFile)
	const rawConfig = {
		tasksFile: relative(taskiDir, config.tasksFile),
		storiesFolder: relative(taskiDir, config.storiesFolder),
		projectTaskPrefix: config.projectTaskPrefix ?? {},
		projectTaskIdNumber: config.projectTaskIdNumber ?? {},
		storyIdNumber: config.storyIdNumber ?? 1,
		projectStoryIdNumber: config.projectStoryIdNumber ?? {},
	}
	const validatedConfig = parse(configSchema, rawConfig)
	const configPath = join(taskiDir, "taski.json")
	const taskiFile = Bun.file(configPath)
	await taskiFile.write(JSON.stringify(validatedConfig, null, "\t"))
}
