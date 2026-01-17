import { buildApplication, buildRouteMap } from "@stricli/core"
import { tasksCommands } from "@/cli/cmd/tasks/tasksCommands"
import { storiesCommands } from "@/cli/cmd/stories/storiesCommands"

const routes = buildRouteMap({
	routes: {
		tasks: tasksCommands,
		stories: storiesCommands,
	},
	docs: {
		brief: "Manage tasks and stories",
	},
})

export const rootCommand = buildApplication(routes, {
	name: "taski",
})
