import { buildRouteMap } from "@stricli/core"
import { storyCreateCommand } from "./storyCreateCommand"
import { storyDeleteCommand } from "./storyDeleteCommand"
import { storyListCommand } from "./storyListCommand"
import { storyReadCommand } from "./storyReadCommand"

export const storyCommands = buildRouteMap({
	routes: {
		list: storyListCommand,
		read: storyReadCommand,
		create: storyCreateCommand,
		delete: storyDeleteCommand,
	},
	docs: {
		brief: "Manage stories",
	},
})
