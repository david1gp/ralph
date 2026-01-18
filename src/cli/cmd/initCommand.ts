import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"
import type { ConfigType } from "@/cli/data/ConfigType"
import { buildCommand, type CommandContext } from "@stricli/core"
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"

interface InitFlags {
  dir?: string
}

const defaultConfig = {
  tasksFile: "tasks.json",
  storiesFolder: "stories",
  projectTaskPrefix: {},
  projectTaskIdNumber: {},
  storyIdNumber: 1,
  projectStoryIdNumber: {},
} satisfies ConfigType

export async function initFunc(this: CommandContext, flags: InitFlags) {
  const baseDir = flags.dir || process.cwd()
  const taskiDir = join(baseDir, ".taski")
  const storiesDir = join(taskiDir, "stories")

  mkdirSync(taskiDir, { recursive: true })

  mkdirSync(storiesDir, { recursive: true })

  writeFileSync(join(taskiDir, "tasks.json"), "[]")

  writeFileSync(join(taskiDir, "taski.json"), jsonStringifyPretty(defaultConfig))

  this.process.stdout.write(`Initialized taski project at ${taskiDir}`)
}

export const initCommand = buildCommand({
  func: initFunc,
  parameters: {
    flags: {
      dir: {
        kind: "parsed",
        parse: String,
        optional: true,
        brief: "Directory to initialize (defaults to current directory)",
      },
    },
  },
  docs: {
    brief: "Initialize taski project structure",
  },
})
