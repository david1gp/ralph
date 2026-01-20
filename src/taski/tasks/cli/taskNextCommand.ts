import { configLoad } from "@/taski/config/configLoad"
import { taskFindNext } from "@/taski/tasks/logic/taskFindNext"
import { taskUpdate } from "@/taski/tasks/logic/taskUpdate"
import { parseDateTime } from "@/taski/utils/dateTime"
import { buildCommand, type CommandContext } from "@stricli/core"
import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"

interface NextFlags {
  config?: string
  start?: string
}

export async function taskNextFunc(this: CommandContext, flags: NextFlags) {
  const configResult = await configLoad(flags.config)
  if (!configResult.success) {
    console.error(configResult)
    process.exit(1)
  }
  const config = configResult.data

  const nextResult = await taskFindNext(config)
  if (!nextResult.success) {
    console.error(nextResult)
    process.exit(1)
  }
  const next = nextResult.data
  if (!next) {
    this.process.stdout.write("No pending tasks found")
    return
  }
  if (flags.start === undefined) {
    this.process.stdout.write(jsonStringifyPretty(next))
    return
  }
  const startResult = parseDateTime(flags.start)
  if (startResult && !startResult.success) {
    console.error(startResult)
    process.exit(1)
  }
  const updateResult = await taskUpdate(config, next.id, { startedAt: startResult?.data })
  if (!updateResult.success) {
    console.error(updateResult)
    process.exit(1)
  }
  this.process.stdout.write(jsonStringifyPretty(updateResult.data))
}

export const taskNextCommand = buildCommand({
  func: taskNextFunc,
  parameters: {
    flags: {
      config: {
        kind: "parsed",
        parse: String,
        optional: true,
        brief: "Path to config file (directory with taski.json or direct path)",
      },
      start: {
        kind: "parsed",
        parse: String,
        optional: true,
        inferEmpty: true,
        brief: "Set startedAt (use 'now', empty to clear, or ISO 8601 timestamp)",
      },
    },
  },
  docs: {
    brief: "Show next pending task",
  },
})
