import { configLoad } from "@/taski/config/configLoad"
import { configSave } from "@/taski/config/configSave"
import type { TaskType } from "@/taski/tasks/data/TaskType"
import { taskCreate } from "@/taski/tasks/logic/taskCreate"
import { taskIdGenerate } from "@/taski/tasks/logic/taskIdGenerate"
import { tasksRead } from "@/taski/tasks/logic/tasksRead"
import { parseDateTime } from "@/taski/utils/dateTime"
import { markdownRestoreWhitespaces } from "@/taski/utils/markdownRestoreWhitespaces"
import { storyExists } from "@/taski/utils/storyExists"
import { buildCommand, type CommandContext } from "@stricli/core"
import { array, parseJson, pipe, safeParse, string, summarize } from "valibot"

interface CreateFlags {
  title: string
  description: string
  acceptanceCriteria: string
  priority?: number
  start?: string
  completedAt?: string
  note?: string
  story: string
  projectPath: string
  config?: string
}

export async function taskCreateFunc(this: CommandContext, flags: CreateFlags) {
  const configResult = await configLoad(flags.config)
  if (!configResult.success) {
    console.error(configResult)
    process.exit(1)
  }
  const config = configResult.data

  const tasksResult = await tasksRead(config)
  if (!tasksResult.success) {
    console.error(tasksResult)
    process.exit(1)
  }
  const tasks = tasksResult.data
  const maxPriority = tasks.length > 0 ? Math.max(...tasks.map((t) => t.priority)) : 0
  const result = safeParse(pipe(string(), parseJson(), array(string())), flags.acceptanceCriteria)
  if (!result.success) {
    const errorResult = {
      success: false,
      op: "taskCreateCommand",
      errorMessage: summarize(result.issues),
    }
    console.error(errorResult)
    process.exit(1)
  }
  const acceptanceCriteria = result.output
  const storyResult = await storyExists(config, flags.story)
  if (!storyResult.success) {
    console.error(storyResult)
    process.exit(1)
  }
  let startedAt: string | undefined
  if (flags.start !== undefined && flags.start !== "") {
    const startResult = parseDateTime(flags.start)
    if (!startResult) {
      const errorResult = {
        success: false,
        op: "taskCreateCommand",
        errorMessage: `Invalid start date format: "${flags.start}"`,
      }
      console.error(errorResult)
      process.exit(1)
    }
    if (!startResult.success) {
      console.error(startResult)
      process.exit(1)
    }
    startedAt = startResult.data
  }

  let completedAt: string | undefined
  if (flags.completedAt !== undefined && flags.completedAt !== "") {
    const endResult = parseDateTime(flags.completedAt)
    if (!endResult) {
      const errorResult = {
        success: false,
        op: "taskCreateCommand",
        errorMessage: `Invalid completed-at date format: "${flags.completedAt}"`,
      }
      console.error(errorResult)
      process.exit(1)
    }
    if (!endResult.success) {
      console.error(endResult)
      process.exit(1)
    }
    completedAt = endResult.data
  }

  const { id, idNumber } = taskIdGenerate(config, flags.projectPath)

  const newTask: TaskType = {
    id: id,
    projectPath: flags.projectPath,
    title: flags.title,
    description: markdownRestoreWhitespaces(flags.description),
    acceptanceCriteria: acceptanceCriteria,
    priority: flags.priority ?? maxPriority + 1,
    note: markdownRestoreWhitespaces(flags.note ?? ""),
    startedAt,
    completedAt,
    story: storyResult.data,
    createdAt: new Date().toISOString(),
  }
  const createdResult = await taskCreate(config, newTask)
  if (!createdResult.success) {
    console.error(createdResult)
    process.exit(1)
  }

  config.projectTaskIdNumber = config.projectTaskIdNumber ?? {}
  config.projectTaskIdNumber[flags.projectPath] = idNumber + 1
  await configSave(config)

  this.process.stdout.write(createdResult.data.id)
}

export const taskCreateCommand = buildCommand({
  func: taskCreateFunc,
  parameters: {
    flags: {
      title: {
        kind: "parsed",
        parse: String,
        optional: false,
        brief: "Set task title",
      },
      description: {
        kind: "parsed",
        parse: String,
        optional: false,
        brief: "Set task description",
      },
      acceptanceCriteria: {
        kind: "parsed",
        parse: String,
        optional: false,
        brief: "Set acceptance criteria (JSON array string, e.g. '[\"Test 1\"]')",
      },
      priority: {
        kind: "parsed",
        parse: Number,
        optional: true,
        brief: "Set task priority (number)",
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
      note: {
        kind: "parsed",
        parse: String,
        optional: true,
        brief: "Set note field",
      },
      story: {
        kind: "parsed",
        parse: String,
        optional: false,
        brief: "Set story reference (filename or path, .md extension optional)",
      },
      projectPath: {
        kind: "parsed",
        parse: String,
        optional: false,
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
    brief: "Create a new task",
  },
})
