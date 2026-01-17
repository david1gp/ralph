import { storyCommands } from "@/cli/cmd/stories/storyCommands"
import { taskCommands } from "@/cli/cmd/tasks/taskCommands"
import { buildApplication, buildRouteMap } from "@stricli/core"

const routes = buildRouteMap({
	routes: {
		tasks: taskCommands,
		stories: storyCommands,
	},
	docs: {
		brief: "Manage tasks and stories",
	},
})

export const taskiCommand = buildApplication(routes, {
	name: "taski",
})
