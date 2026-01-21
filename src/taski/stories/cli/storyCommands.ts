import { buildRouteMap } from "@stricli/core"
import { storyCreateCommand } from "./storyCreateCommand"
import { storyDeleteCommand } from "./storyDeleteCommand"
import { storyListCommand } from "./storyListCommand"
import { storyPathCommand } from "./storyPathCommand"
import { storyReadCommand } from "./storyReadCommand"
import { storyUpdateCommand } from "./storyUpdateCommand"

export const storyCommands = buildRouteMap({
  routes: {
    list: storyListCommand,
    path: storyPathCommand,
    read: storyReadCommand,
    create: storyCreateCommand,
    delete: storyDeleteCommand,
    update: storyUpdateCommand,
  },
  docs: {
    brief: "Manage stories",
  },
})
