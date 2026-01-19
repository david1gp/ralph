import { configLoad } from "@/cli/config/configLoad"
import { taskDelete } from "@/cli/tasks/logic/taskDelete"
import { buildCommand, type CommandContext } from "@stricli/core"

interface DeleteFlags {
  config?: string
}

export const taskDeleteCommand = buildCommand({
  async func(this: CommandContext, flags: DeleteFlags, id: string) {
    const configResult = await configLoad(flags.config)
    if (!configResult.success) {
      console.error(configResult)
      process.exit(1)
    }
    const config = configResult.data

    const result = await taskDelete(config, id)
    if (!result.success) {
      console.error(result)
      process.exit(1)
    }
    this.process.stdout.write(`Task "${id}" deleted successfully`)
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
    brief: "Delete a task by ID",
  },
})
