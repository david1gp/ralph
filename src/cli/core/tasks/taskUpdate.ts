import { tasksRead } from "@/cli/core/tasks/tasksRead"
import { tasksWrite } from "@/cli/core/tasks/tasksWrite"
import type { ConfigType } from "@/cli/data/ConfigType"
import type { TaskType } from "@/cli/data/TaskType"
import { taskValidate } from "@/cli/data/taskValidate"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"

export async function taskUpdate(config: ConfigType, id: string, updates: Partial<TaskType>): PromiseResult<TaskType> {
  const tasksResult = await tasksRead(config)
  if (!tasksResult.success) {
    return tasksResult
  }
  const tasks = tasksResult.data
  const index = tasks.findIndex((t) => t.id === id)
  if (index === -1) {
    return createError("taskUpdate", `Task with id "${id}" not found`)
  }
  const result = taskValidate(JSON.stringify({ ...tasks[index], ...updates }))
  if (!result.success) {
    return createError("taskUpdate", "Invalid task")
  }
  const updatedTask = result.output as TaskType
  tasks[index] = updatedTask
  const writeResult = await tasksWrite(config, tasks)
  if (!writeResult.success) {
    return writeResult
  }
  return createResult(updatedTask)
}
