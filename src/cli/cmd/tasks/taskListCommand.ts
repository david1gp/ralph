import { configLoad } from "@/cli/core/config/configLoad"
import { tasksRead } from "@/cli/core/tasks/tasksRead"
import { buildCommand, type CommandContext } from "@stricli/core"

interface ListFlags {
  config?: string
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
      this.process.stdout.write(JSON.stringify([]))
      return
    }
    const tasks = tasksResult.data
    this.process.stdout.write(JSON.stringify(tasks))
  },
  parameters: {
    flags: {
      config: {
        kind: "parsed",
        parse: String,
        optional: true,
        brief: "Path to config file (directory with taski.json or direct path)",
      },
    },
  },
  docs: {
    brief: "List all tasks",
  },
})
