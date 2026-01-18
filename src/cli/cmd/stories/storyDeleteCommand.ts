import { configLoad } from "@/cli/core/config/configLoad"
import { storyDelete } from "@/cli/core/stories/storyDelete"
import { buildCommand, type CommandContext } from "@stricli/core"

interface DeleteFlags {
  config?: string
}

export const storyDeleteCommand = buildCommand({
  async func(this: CommandContext, flags: DeleteFlags, filename: string) {
    const configResult = await configLoad(flags.config)
    if (!configResult.success) {
      console.error(configResult)
      process.exit(1)
    }
    const config = configResult.data

    const result = await storyDelete(config, filename)
    if (!result.success) {
      console.error(result)
      process.exit(1)
    }
    this.process.stdout.write(`Story "${filename}" deleted successfully`)
  },
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [
        {
          brief: "Story filename",
          parse: String,
          placeholder: "filename",
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
    brief: "Delete a story by filename",
  },
})
