#!/usr/bin/env bun
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { buildApplication, buildCommand, type CommandContext, run } from "@stricli/core"
import type { RalphConfig } from "@/ralph/data/RalphConfig"
import { runRalphLoop } from "@/ralph/logic/runRalphLoop"

const __dirname = dirname(fileURLToPath(import.meta.url))

interface Flags {
  verbose?: boolean
  maxIterations?: number
}

const ralphCommand = buildCommand({
  async func(this: CommandContext, flags: Flags) {
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
})

await run(app, process.argv.slice(2), { process })
