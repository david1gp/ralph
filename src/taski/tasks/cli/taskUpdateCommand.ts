import { configLoad } from "@/taski/config/configLoad"
import type { TaskType } from "@/taski/tasks/data/TaskType"
import { taskArchive } from "@/taski/tasks/logic/archive/taskArchive"
import { taskUpdate } from "@/taski/tasks/logic/taskUpdate"
import { parseDateTime } from "@/taski/utils/dateTime"
import { markdownRestoreWhitespaces } from "@/taski/utils/markdownRestoreWhitespaces"
import { storyExists } from "@/taski/utils/storyExists"
import { buildCommand, type CommandContext } from "@stricli/core"
import { array, safeParse, string } from "valibot"

interface UpdateFlags {
  archive?: boolean
  start?: string
  completedAt?: string
  created?: string
  note?: string
  title?: string
  description?: string
  acceptanceCriteria?: string
  priority?: number
  story?: string
  projectPath?: string
  config?: string
  gitDiff?: string
}

export async function taskUpdateFunc(this: CommandContext, flags: UpdateFlags, id: string) {
  const configResult = await configLoad(flags.config)
  if (!configResult.success) {
    console.error(configResult)
    process.exit(1)
  }
  const config = configResult.data

  const updates: Partial<TaskType> = {}
  if (flags.start !== undefined) {
    const startResult = parseDateTime(flags.start)
    if (startResult && !startResult.success) {
      console.error(startResult)
      process.exit(1)
    }
    updates.startedAt = startResult?.data
  }
  if (flags.completedAt !== undefined) {
    const endResult = parseDateTime(flags.completedAt)
    if (endResult && !endResult.success) {
      console.error(endResult)
      process.exit(1)
    }
    updates.completedAt = endResult?.data
  }
  if (flags.created !== undefined) {
    const createdResult = parseDateTime(flags.created)
    if (createdResult && !createdResult.success) {
      console.error(createdResult)
      process.exit(1)
    }
    updates.createdAt = createdResult?.data
  }
  if (flags.note !== undefined) {
    updates.note = markdownRestoreWhitespaces(flags.note)
  }
  if (flags.title !== undefined) {
    updates.title = flags.title
  }
  if (flags.description !== undefined) {
    updates.description = markdownRestoreWhitespaces(flags.description)
  }
  if (flags.acceptanceCriteria !== undefined) {
    const result = safeParse(array(string()), flags.acceptanceCriteria)
    if (!result.success) {
      const errorResult = {
        success: false,
        op: "taskUpdateCommand",
        errorMessage: `Invalid acceptance criteria format: "${flags.acceptanceCriteria}". Expected JSON array of strings.`,
      }
      console.error(errorResult)
      process.exit(1)
    }
    updates.acceptanceCriteria = result.output
  }
  if (flags.priority !== undefined) {
    updates.priority = flags.priority
  }
  if (flags.story !== undefined) {
    const storyResult = await storyExists(config, flags.story)
    if (!storyResult.success) {
      console.error(storyResult)
      process.exit(1)
    }
    updates.story = storyResult.data
  }
  if (flags.projectPath !== undefined) {
    updates.projectPath = flags.projectPath
  }
  if (flags.gitDiff !== undefined) {
    updates.gitDiff = flags.gitDiff
  }

  const shouldArchive = flags.archive === true || !!flags.completedAt

  if (shouldArchive) {
    const updatedResult = await taskUpdate(config, id, updates)
    if (!updatedResult.success) {
      console.error(updatedResult)
      process.exit(1)
    }
    const updated = updatedResult.data
    const archiveResult = await taskArchive(config, id)
    if (!archiveResult.success) {
      console.error(archiveResult)
      process.exit(1)
    }
    const archived = archiveResult.data
    this.process.stdout.write(`Task "${archived.id}" archived successfully`)
    return
  }

  const updatedResult = await taskUpdate(config, id, updates)
  if (!updatedResult.success) {
    console.error(updatedResult)
    process.exit(1)
  }
  const updated = updatedResult.data
  this.process.stdout.write(`Task "${updated.id}" updated successfully`)
}

export const taskUpdateCommand = buildCommand({
  func: taskUpdateFunc,
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [
        {
          brief: "Task ID",
          parse: String,
          placeholder: "id",
        },
      ],
    },
    flags: {
      archive: {
        kind: "boolean",
        optional: true,
        brief: "Archive this task",
      },
      start: {
        kind: "parsed",
        parse: String,
        optional: true,
        inferEmpty: true,
        brief: "Set startedAt (use 'now', empty to clear, or ISO 8601 timestamp)",
      },
      completedAt: {
        kind: "parsed",
        parse: String,
        optional: true,
        inferEmpty: true,
        brief: "Set completedAt (use 'now', empty to clear, or ISO 8601 timestamp)",
      },
      created: {
        kind: "parsed",
        parse: String,
        optional: true,
        inferEmpty: true,
        brief: "Set createdAt (use 'now', empty to clear, or ISO 8601 timestamp)",
      },
      note: {
        kind: "parsed",
        parse: String,
        optional: true,
        brief: "Set note field",
      },
      title: {
        kind: "parsed",
        parse: String,
        optional: true,
        brief: "Set task title (use empty string to clear)",
      },
      description: {
        kind: "parsed",
        parse: String,
        optional: true,
        brief: "Set task description (use empty string to clear)",
      },
      acceptanceCriteria: {
        kind: "parsed",
        parse: String,
        optional: true,
        brief: "Set acceptance criteria (JSON array string, e.g. '[\"Test 1\"]')",
      },
      priority: {
        kind: "parsed",
        parse: Number,
        optional: true,
        brief: "Set task priority (number)",
      },
      story: {
        kind: "parsed",
        parse: String,
        optional: true,
        inferEmpty: true,
        brief: "Set story reference (filename or path, empty to clear)",
      },
      projectPath: {
        kind: "parsed",
        parse: String,
        optional: true,
        brief: "Project path",
      },
      gitDiff: {
        kind: "parsed",
        parse: String,
        optional: true,
        brief: "Git diff shortstat output",
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
    brief: "Update a task",
  },
})
