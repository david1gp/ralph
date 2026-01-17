import { join } from "node:path"
import { storyFolderPathGet } from "@/cli/core/storyFolderPathGet"

export function storyPathGet(filename: string): string {
	if (filename === "") {
		return ""
	}
	if (filename.startsWith("/")) {
		return filename
	}
	return join(storyFolderPathGet(), filename)
}
