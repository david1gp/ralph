import { configLoad } from "@/taski/config/configLoad"
import { configSave } from "@/taski/config/configSave"
import { storyCreate } from "@/taski/stories/logic/storyCreate"
import { projectPathExists, shortTitleFormat } from "@/taski/stories/logic/storyInputValidate"
import { markdownRestoreWhitespaces } from "@/taski/utils/markdownRestoreWhitespaces"
import { buildCommand, type CommandContext } from "@stricli/core"

interface CreateFlags {
  shortTitle: string
  projectPath: string
  content: string
  config?: string
}

export async function storyCreateFunc(this: CommandContext, flags: CreateFlags) {
  const configResult = await configLoad(flags.config)
  if (!configResult.success) {
    console.error(configResult)
    process.exit(1)
  }
  const config = configResult.data

  const dirResult = await projectPathExists(flags.projectPath)
  if (!dirResult.success) {
    console.error(dirResult)
    process.exit(1)
  }

  const titleResult = shortTitleFormat(flags.shortTitle)
  if (!titleResult.success) {
    console.error(titleResult)
    process.exit(1)
  }

  const result = await storyCreate(config, {
    shortTitle: titleResult.data,
    projectPath: flags.projectPath,
    content: markdownRestoreWhitespaces(flags.content),
  })
  if (!result.success) {
    console.error(result)
    process.exit(1)
  }

  config.storyIdNumber = (config.storyIdNumber ?? 1) + 1
  config.projectStoryIdNumber = config.projectStoryIdNumber ?? {}
  config.projectStoryIdNumber[flags.projectPath] = (config.projectStoryIdNumber[flags.projectPath] ?? 1) + 1
  await configSave(config)

  const filename = result.data.filePath.split("/").pop()!
  this.process.stdout.write(filename)
}

export const storyCreateCommand = buildCommand({
  func: storyCreateFunc,
  parameters: {
    flags: {
      shortTitle: {
        kind: "parsed",
        parse: String,
        optional: false,
        brief: "Short story title (spaces and underscores will be replaced with dashes)",
      },
      projectPath: {
        kind: "parsed",
        parse: String,
        optional: false,
        brief: "Project path",
      },
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
    brief: "Create a new story",
  },
})
