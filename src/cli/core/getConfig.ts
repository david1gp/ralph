import { getTasksFilePath } from "@/cli/core/getTasksFilePath"
import { getStoriesFolderPath } from "@/cli/core/getStoriesFolderPath"

export function getConfig(): { tasksFile: string; storiesFolder: string } {
	return {
		tasksFile: getTasksFilePath(),
		storiesFolder: getStoriesFolderPath(),
	}
}
