import { buildApplication, buildRouteMap } from "@stricli/core"
import { tasksCommands } from "./tasks/index.js"
import { storiesCommands } from "./stories/index.js"

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
