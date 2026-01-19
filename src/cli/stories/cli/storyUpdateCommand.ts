import { configLoad } from "@/cli/config/configLoad"
import type { StoryType } from "@/cli/stories/data/StoryType"
import { storyUpdate } from "@/cli/stories/logic/storyUpdate"
import { markdownRestoreWhitespaces } from "@/cli/utils/markdownRestoreWhitespaces"
import { buildCommand, type CommandContext } from "@stricli/core"

interface UpdateFlags {
  title?: string
  description?: string
  goals?: string
  userTasks?: string
  projectPath?: string
  config?: string
}

function parseArray(value: string | undefined): Array<string> | undefined {
  if (value === undefined || value === "") {
    return undefined
  }
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "")
}

export const storyUpdateCommand = buildCommand({
  async func(this: CommandContext, flags: UpdateFlags, filename: string) {
    const configResult = await configLoad(flags.config)
    if (!configResult.success) {
      console.error(configResult)
      process.exit(1)
    }
    const config = configResult.data

    const updates: Partial<StoryType> = {}
    if (flags.title !== undefined) {
      updates.title = flags.title
    }
    if (flags.description !== undefined) {
      updates.description = markdownRestoreWhitespaces(flags.description)
    }
    if (flags.goals !== undefined) {
      updates.goals = parseArray(flags.goals)
    }
    if (flags.userTasks !== undefined) {
      updates.userTasks = parseArray(flags.userTasks)
    }
    if (flags.projectPath !== undefined) {
      updates.projectPath = flags.projectPath
    }
    const updatedResult = await storyUpdate(config, filename, updates)
    if (!updatedResult.success) {
      console.error(updatedResult)
      process.exit(1)
    }
    const updated = updatedResult.data
    this.process.stdout.write(`Story "${updated.title}" updated successfully`)
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
      title: {
        kind: "parsed",
        parse: String,
        optional: true,
        brief: "Set story title",
      },
      description: {
        kind: "parsed",
        parse: String,
        optional: true,
        brief: "Set story description",
      },
      goals: {
        kind: "parsed",
        parse: String,
        optional: true,
        brief: "Set story goals (comma-separated)",
      },
      userTasks: {
        kind: "parsed",
        parse: String,
        optional: true,
        brief: "Set story user tasks (comma-separated)",
      },
      projectPath: {
        kind: "parsed",
        parse: String,
        optional: true,
        brief: "Project path",
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
