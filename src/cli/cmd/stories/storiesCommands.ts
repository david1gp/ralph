import { buildRouteMap } from "@stricli/core"
import { storiesListCommand } from "./storiesListCommand"
import { storiesReadCommand } from "./storiesReadCommand"
import { storiesCreateCommand } from "./storiesCreateCommand"
import { storiesDeleteCommand } from "./storiesDeleteCommand"

export const storiesCommands = buildRouteMap({
	routes: {
		list: storiesListCommand,
		read: storiesReadCommand,
		create: storiesCreateCommand,
		delete: storiesDeleteCommand,
	},
	docs: {
		brief: "Manage stories",
	},
})
