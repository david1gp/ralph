import { configLoad } from "@/cli/core/config/configLoad"
import { storiesList } from "@/cli/core/stories/storiesList"
import { buildCommand, type CommandContext } from "@stricli/core"
import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"

interface ListFlags {
  config?: string
}

export const storyListCommand = buildCommand({
  async func(this: CommandContext, flags: ListFlags) {
    const configResult = await configLoad(flags.config)
    if (!configResult.success) {
      console.error(configResult)
      process.exit(1)
    }
    const config = configResult.data

    const storiesResult = await storiesList(config)
    if (!storiesResult.success) {
      console.error(storiesResult)
      process.exit(1)
    }
    this.process.stdout.write(jsonStringifyPretty(storiesResult.data))
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
    brief: "List all stories",
  },
})
