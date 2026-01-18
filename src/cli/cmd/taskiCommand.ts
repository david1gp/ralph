import { storyCommands } from "@/cli/cmd/stories/storyCommands"
import { taskCommands } from "@/cli/cmd/tasks/taskCommands"
import { initCommand } from "@/cli/cmd/initCommand"
import { buildApplication, buildRouteMap } from "@stricli/core"

const routes = buildRouteMap({
	routes: {
		init: initCommand,
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
