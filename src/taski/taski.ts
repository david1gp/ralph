#!/usr/bin/env bun
import { buildApplication, buildRouteMap, run } from "@stricli/core"
import { packageVersion } from "@/packageVersion"
import { taskiVersionCommand } from "@/taski/taskiVersionCommand"

const inputs = process.argv.slice(2)
const versionInput = inputs[0] === "version" || inputs[0] === "--version" || inputs[0] === "-v"

const routes = versionInput
  ? buildRouteMap({
      routes: { version: taskiVersionCommand },
      docs: { brief: "Print taski version" },
    })
  : buildRouteMap({
      routes: {
        init: (await import("@/taski/init/initCommand")).initCommand,
        tasks: (await import("@/taski/tasks/cli/taskCommands")).taskCommands,
        stories: (await import("@/taski/stories/cli/storyCommands")).storyCommands,
      },
      docs: {
        brief: "Manage tasks and stories",
      },
    })

export const taskiCommand = buildApplication(routes, {
  name: "taski",
  versionInfo: {
    currentVersion: packageVersion,
  },
})

await run(taskiCommand, inputs, { process })
