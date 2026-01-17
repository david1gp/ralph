import { buildRouteMap } from "@stricli/core"
import { tasksListCommand } from "./list.js"
import { tasksReadCommand } from "./read.js"
import { tasksCreateCommand } from "./create.js"
import { tasksUpdateCommand } from "./update.js"
import { tasksNextCommand } from "./next.js"
import { tasksDeleteCommand } from "./delete.js"

export const tasksCommands = buildRouteMap({
	routes: {
		list: tasksListCommand,
		read: tasksReadCommand,
		create: tasksCreateCommand,
		update: tasksUpdateCommand,
		next: tasksNextCommand,
		delete: tasksDeleteCommand,
	},
	docs: {
		brief: "Manage tasks",
	},
})
