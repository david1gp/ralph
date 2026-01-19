import { tasksArchivedRead } from "@/cli/core/tasks/archive/tasksArchivedRead"
import { tasksArchivedWrite } from "@/cli/core/tasks/archive/tasksArchivedWrite"
import { tasksRead } from "@/cli/core/tasks/tasksRead"
import { tasksWrite } from "@/cli/core/tasks/tasksWrite"
import type { ConfigType } from "@/cli/data/ConfigType"
import type { TaskType } from "@/cli/data/TaskType"
import { taskValidate } from "@/cli/data/taskValidate"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"

export async function taskArchive(config: ConfigType, taskId: string): PromiseResult<TaskType> {
  const tasksResult = await tasksRead(config)
  if (!tasksResult.success) {
    return tasksResult
  }
  const tasks = tasksResult.data

  const index = tasks.findIndex((t) => t.id === taskId)
  if (index === -1) {
    return createError("taskArchive", `Task with id "${taskId}" not found`)
  }

  const task = tasks[index]!
  const result = taskValidate(JSON.stringify({ ...task, passes: true }))
  if (!result.success) {
    return createError("taskArchive", "Invalid task")
  }
  const updatedTask = result.output

  const dateField = task.endedAt ?? task.startedAt ?? task.createdAt
  if (!dateField) {
    return createError("taskArchive", `Task "${taskId}" has no date field (endedAt, startedAt, or createdAt)`)
  }

  const date = new Date(dateField)
  const yearMonth = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`

  const archivedResult = await tasksArchivedRead(config, yearMonth)
  if (!archivedResult.success) {
    return archivedResult
  }
  const archivedTasks = archivedResult.data

  archivedTasks.push(updatedTask)

  const writeArchivedResult = await tasksArchivedWrite(config, yearMonth, archivedTasks)
  if (!writeArchivedResult.success) {
    return writeArchivedResult
  }

  const activeTasks = tasks.filter((t) => t.id !== taskId)
  const writeActiveResult = await tasksWrite(config, activeTasks)
  if (!writeActiveResult.success) {
    return writeActiveResult
  }

  return createResult(updatedTask)
}
