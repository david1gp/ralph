import { buildRouteMap } from "@stricli/core"
import { taskCreateCommand } from "./taskCreateCommand"
import { taskDeleteCommand } from "./taskDeleteCommand"
import { taskListCommand } from "./taskListCommand"
import { taskNextCommand } from "./taskNextCommand"
import { taskReadCommand } from "./taskReadCommand"
import { taskUpdateCommand } from "./taskUpdateCommand"

export const taskCommands = buildRouteMap({
  routes: {
    list: taskListCommand,
    read: taskReadCommand,
    create: taskCreateCommand,
    update: taskUpdateCommand,
    next: taskNextCommand,
    delete: taskDeleteCommand,
  },
  docs: {
    brief: "Manage tasks",
  },
})
