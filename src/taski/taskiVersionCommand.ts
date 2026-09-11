import { buildCommand, type CommandContext } from "@stricli/core"
import { cliVersionOutputRender } from "@/cliVersionOutputRender"

interface VersionFlags {
  verbose?: boolean
}

export const taskiVersionCommand = buildCommand({
  func(this: CommandContext, flags: VersionFlags) {
    this.process.stdout.write(cliVersionOutputRender("taski", flags.verbose ?? false))
  },
  parameters: {
    flags: {
      verbose: {
        brief: "Include runtime and package details",
        kind: "boolean",
        optional: true,
      },
    },
  },
  docs: {
    brief: "Print the taski version",
  },
})
