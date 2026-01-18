import { tasksRead } from "@/cli/core/tasks/tasksRead"
import { tasksWrite } from "@/cli/core/tasks/tasksWrite"
import type { ConfigType } from "@/cli/data/ConfigType"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"

export async function taskDelete(config: ConfigType, id: string): PromiseResult<boolean> {
  const tasksResult = await tasksRead(config)
  if (!tasksResult.success) {
    return tasksResult
  }
  const tasks = tasksResult.data
  const index = tasks.findIndex((t) => t.id === id)
  if (index === -1) {
    return createError("taskDelete", `Task with id "${id}" not found`)
  }
  tasks.splice(index, 1)
  const writeResult = await tasksWrite(config, tasks)
  if (!writeResult.success) {
    return writeResult
  }
  return createResult(true)
}
