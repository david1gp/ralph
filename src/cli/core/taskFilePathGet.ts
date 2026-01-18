import { configGet } from "@/cli/core/configGet"

export async function taskFilePathGet(): Promise<string> {
	const config = await configGet()
	return config.tasksFile
}
