#!/usr/bin/env bun
import { initCommand } from "@/cli/init/initCommand"
import { storyCommands } from "@/cli/stories/cli/storyCommands"
import { taskCommands } from "@/cli/tasks/cli/taskCommands"
import { buildApplication, buildRouteMap, run } from "@stricli/core"

const routes = buildRouteMap({
  routes: {
    init: initCommand,
    tasks: taskCommands,
    stories: storyCommands,
  },
  docs: {
    brief: "Manage tasks and stories",
  },
})

export const taskiCommand = buildApplication(routes, {
  name: "taski",
})

await run(taskiCommand, process.argv.slice(2), { process })
