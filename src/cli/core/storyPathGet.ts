import { join } from "node:path"
import { storyFolderPathGet } from "@/cli/core/storyFolderPathGet"

export async function storyPathGet(filename: string): Promise<string> {
	if (filename === "") {
		return ""
	}
	if (filename.startsWith("/")) {
		return filename
	}
	const storiesPath = await storyFolderPathGet()
	return join(storiesPath, filename)
}
