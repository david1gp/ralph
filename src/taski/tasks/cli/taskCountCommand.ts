import { configLoad } from "@/taski/config/configLoad"
import { tasksRead } from "@/taski/tasks/logic/tasksRead"
import { buildCommand, type CommandContext } from "@stricli/core"

interface CountFlags {
  config?: string
  story?: string
  projectPath?: string
}

export const taskCountCommand = buildCommand({
  async func(this: CommandContext, flags: CountFlags) {
    const configResult = await configLoad(flags.config)
    if (!configResult.success) {
      console.error(configResult)
      process.exit(1)
    }
    const config = configResult.data

    const tasksResult = await tasksRead(config)
    if (!tasksResult.success) {
      this.process.stdout.write("0")
      return
    }
    let tasks = tasksResult.data

    if (flags.story !== undefined) {
      tasks = tasks.filter((task) => task.story === flags.story)
    }

    if (flags.projectPath !== undefined) {
      tasks = tasks.filter((task) => task.projectPath === flags.projectPath)
    }

    this.process.stdout.write(String(tasks.length))
  },
  parameters: {
    flags: {
      config: {
        kind: "parsed",
        parse: String,
        optional: true,
        brief: "Path to config file (directory with taski.json or direct path)",
      },
      story: {
        kind: "parsed",
        parse: String,
        optional: true,
        brief: "Filter tasks by story filename",
      },
      projectPath: {
        kind: "parsed",
        parse: String,
        optional: true,
        brief: "Filter tasks by project path",
      },
    },
  },
  docs: {
    brief: "Count all tasks",
  },
})
