#!/usr/bin/env bun
import { initCommand } from "@/taski/init/initCommand"
import { storyCommands } from "@/taski/stories/cli/storyCommands"
import { taskCommands } from "@/taski/tasks/cli/taskCommands"
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
