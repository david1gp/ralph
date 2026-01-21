import { configLoad } from "@/taski/config/configLoad"
import { storyFolderPathGet } from "@/taski/stories/logic/storyFolderPathGet"
import { buildCommand, type CommandContext } from "@stricli/core"
import { join } from "node:path"

interface PathFlags {
  config?: string
}

export const storyPathCommand = buildCommand({
  async func(this: CommandContext, flags: PathFlags, id: string) {
    const configResult = await configLoad(flags.config)
    if (!configResult.success) {
      console.error(configResult)
      process.exit(1)
    }
    const config = configResult.data

    const storiesPathResult = await storyFolderPathGet(config)
    if (!storiesPathResult.success) {
      console.error(storiesPathResult)
      process.exit(1)
    }
    const storiesPath = storiesPathResult.data
    const filename = id.endsWith(".md") ? id : `${id}.md`
    const filePath = join(storiesPath, filename)
    this.process.stdout.write(filePath)
  },
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [
        {
          brief: "Story id",
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
    brief: "Get the file path of a story by id",
  },
})
