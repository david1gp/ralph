import { buildRouteMap } from "@stricli/core"
import { taskCountCommand } from "./taskCountCommand"
import { taskCreateCommand } from "./taskCreateCommand"
import { taskDeleteCommand } from "./taskDeleteCommand"
import { taskListCommand } from "./taskListCommand"
import { taskNextCommand } from "./taskNextCommand"
import { taskReadCommand } from "./taskReadCommand"
import { taskUpdateCommand } from "./taskUpdateCommand"

export const taskCommands = buildRouteMap({
  routes: {
    count: taskCountCommand,
    create: taskCreateCommand,
    delete: taskDeleteCommand,
    list: taskListCommand,
    next: taskNextCommand,
    read: taskReadCommand,
    update: taskUpdateCommand,
  },
  docs: {
    brief: "Manage tasks",
  },
})
