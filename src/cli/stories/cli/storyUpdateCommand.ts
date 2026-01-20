import { configLoad } from "@/cli/config/configLoad"
import { storyUpdate } from "@/cli/stories/logic/storyUpdate"
import { buildCommand, type CommandContext } from "@stricli/core"

interface UpdateFlags {
  content: string
  config?: string
}

export const storyUpdateCommand = buildCommand({
  async func(this: CommandContext, flags: UpdateFlags, filename: string) {
    const configResult = await configLoad(flags.config)
    if (!configResult.success) {
      console.error(configResult)
      process.exit(1)
    }
    const config = configResult.data

    let content: string
    if (flags.content === "-") {
      const chunks: string[] = []
      for await (const chunk of process.stdin) {
        chunks.push(chunk)
      }
      content = chunks.join("").trim()
    } else {
      content = flags.content
    }

    const result = await storyUpdate(config, filename, content)
    if (!result.success) {
      console.error(result)
      process.exit(1)
    }
    this.process.stdout.write("Story updated successfully")
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
      content: {
        kind: "parsed",
        parse: String,
        optional: false,
        brief: "Story content",
      },
      config: {
        kind: "parsed",
        parse: String,
        optional: true,
        brief: "Path to config file (directory with taski.json or direct path)",
      },
    },
  },
  docs: {
    brief: "Update a story",
  },
})
