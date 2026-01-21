import { configLoad } from "@/taski/config/configLoad"
import { tasksRead } from "@/taski/tasks/logic/tasksRead"
import { buildCommand, type CommandContext } from "@stricli/core"
import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"

interface ListFlags {
  config?: string
  story?: string
}

export const taskListCommand = buildCommand({
  async func(this: CommandContext, flags: ListFlags) {
    const configResult = await configLoad(flags.config)
    if (!configResult.success) {
      console.error(configResult)
      process.exit(1)
    }
    const config = configResult.data

    const tasksResult = await tasksRead(config)
    if (!tasksResult.success) {
      this.process.stdout.write(jsonStringifyPretty([]))
      return
    }
    let tasks = tasksResult.data

    if (flags.story !== undefined) {
      tasks = tasks.filter(task => task.story === flags.story)
    }

    this.process.stdout.write(jsonStringifyPretty(tasks))
  },
  parameters: {
    flags: {
      config: {
        kind: "parsed",
        parse: String,
        optional: true,
        brief: "Path to config file (directory with taski.json or direct path)",
      },
      story: {
        kind: "parsed",
        parse: String,
        optional: true,
        brief: "Filter tasks by story filename",
      },
    },
  },
  docs: {
    brief: "List all tasks",
  },
})
