import { buildRouteMap } from "@stricli/core"
import { tasksListCommand } from "./tasksListCommand"
import { tasksReadCommand } from "./tasksReadCommand"
import { tasksCreateCommand } from "./tasksCreateCommand"
import { tasksUpdateCommand } from "./tasksUpdateCommand"
import { tasksNextCommand } from "./tasksNextCommand"
import { tasksDeleteCommand } from "./tasksDeleteCommand"

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
