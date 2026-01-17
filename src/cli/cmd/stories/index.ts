import { buildRouteMap } from "@stricli/core"
import { storiesListCommand } from "./list.js"
import { storiesReadCommand } from "./read.js"
import { storiesCreateCommand } from "./create.js"
import { storiesDeleteCommand } from "./delete.js"

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
