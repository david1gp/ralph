#!/usr/bin/env bun
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { buildApplication, buildChoiceParser, buildCommand, type CommandContext, run } from "@stricli/core"
import { cliVersionOutputRender } from "@/cliVersionOutputRender"
import { packageVersion } from "@/packageVersion"
import type { RalphConfig } from "@/ralph/data/RalphConfig"

const __dirname = dirname(fileURLToPath(import.meta.url))

interface Flags {
  verbose?: boolean
  maxIterations?: number
}

const ralphCommand = buildCommand({
  async func(this: CommandContext, flags: Flags, command?: string) {
    if (command === "version") {
      this.process.stdout.write(cliVersionOutputRender("ralph", flags.verbose ?? false))
      return
    }

    const { runRalphLoop } = await import("@/ralph/logic/runRalphLoop")
    const maxIterations = flags.maxIterations ?? 50

    const config: RalphConfig = {
      maxIterations,
      scriptDir: __dirname,
      verbose: flags.verbose ?? false,
    }

    console.log({
      ...config,
      msg: "Starting ralph",
      startedAt: new Date().toISOString(),
    })

    await runRalphLoop(config)
  },
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [
        {
          brief: "Command",
          optional: true,
          parse: buildChoiceParser(["version"]),
          placeholder: "command",
        },
      ],
    },
    flags: {
      verbose: {
        kind: "boolean",
        brief: "Enable verbose output",
        optional: true,
      },
      maxIterations: {
        kind: "parsed",
        parse: Number,
        brief: "Maximum iterations (default: 50)",
        optional: true,
      },
    },
  },
  docs: {
    brief: "Run Ralph agent loop",
  },
})

export const app = buildApplication(ralphCommand, {
  name: "ralph",
  versionInfo: {
    currentVersion: packageVersion,
  },
})

await run(app, process.argv.slice(2), { process })
