import { configLoad } from "@/taski/config/configLoad"
import { tasksRead } from "@/taski/tasks/logic/tasksRead"
import { buildCommand, type CommandContext } from "@stricli/core"
import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"

interface ReadFlags {
  config?: string
}

export const taskReadCommand = buildCommand({
  async func(this: CommandContext, flags: ReadFlags, id: string) {
    const configResult = await configLoad(flags.config)
    if (!configResult.success) {
      console.error(configResult)
      process.exit(1)
    }
    const config = configResult.data

    const tasksResult = await tasksRead(config)
    if (!tasksResult.success) {
      console.error(tasksResult)
      process.exit(1)
    }
    const tasks = tasksResult.data
    const task = tasks.find((t) => t.id === id)
    if (task) {
      this.process.stdout.write(jsonStringifyPretty(task))
    } else {
      const errorResult = { success: false, op: "taskRead", errorMessage: `Task "${id}" not found` }
      console.error(errorResult)
      process.exit(1)
    }
  },
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [
        {
          brief: "Task ID",
          parse: String,
          placeholder: "id",
        },
      ],
    },
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
    brief: "Read a task by ID",
  },
})
