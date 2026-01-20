import type { ConfigType } from "@/taski/config/ConfigType"
import { tasksRead } from "@/taski/tasks/logic/tasksRead"
import { tasksWrite } from "@/taski/tasks/logic/tasksWrite"
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
