import type { ConfigType } from "@/taski/config/ConfigType"
import type { TaskType } from "@/taski/tasks/data/TaskType"
import { taskValidate } from "@/taski/tasks/data/taskValidate"
import { tasksRead } from "@/taski/tasks/logic/tasksRead"
import { tasksWrite } from "@/taski/tasks/logic/tasksWrite"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"

export async function taskCreate(config: ConfigType, task: TaskType): PromiseResult<TaskType> {
  const tasksResult = await tasksRead(config)
  if (!tasksResult.success) {
    return tasksResult
  }
  const tasks = tasksResult.data
  const result = taskValidate(JSON.stringify(task))
  if (!result.success) {
    return createError("taskCreate", "Invalid task")
  }
  const newTask = result.output as TaskType
  tasks.push(newTask)
  const writeResult = await tasksWrite(config, tasks)
  if (!writeResult.success) {
    return writeResult
  }
  return createResult(newTask)
}
