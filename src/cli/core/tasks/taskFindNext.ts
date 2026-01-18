import { tasksRead } from "@/cli/core/tasks/tasksRead"
import type { ConfigType } from "@/cli/data/ConfigType"
import type { TaskType } from "@/cli/data/TaskType"
import { createResult, type PromiseResult } from "~utils/result/Result"

export async function taskFindNext(config: ConfigType): PromiseResult<TaskType | undefined> {
  const tasksResult = await tasksRead(config)
  if (!tasksResult.success) {
    return tasksResult
  }
  const incomplete = tasksResult.data
    .filter((task) => task.passes === false)
    .sort((a, b) => {
      const aIndex = tasksResult.data.indexOf(a)
      const bIndex = tasksResult.data.indexOf(b)
      const aVirtual = a.priority * 1000 - aIndex
      const bVirtual = b.priority * 1000 - bIndex
      return bVirtual - aVirtual
    })
  return createResult(incomplete[0])
}
