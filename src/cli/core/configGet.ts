import { storyFolderPathGet } from "@/cli/core/storyFolderPathGet"
import { taskFilePathGet } from "@/cli/core/taskFilePathGet"

export function configGet(): { tasksFile: string; storiesFolder: string } {
	return {
		tasksFile: taskFilePathGet(),
		storiesFolder: storyFolderPathGet(),
	}
}
