import { configGet } from "@/cli/core/configGet"

export async function storyFolderPathGet(): Promise<string> {
	const config = await configGet()
	return config.storiesFolder
}
