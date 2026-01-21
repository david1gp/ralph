import { taskSchema } from "@/taski/tasks/data/taskSchema"
import type { TaskType } from "@/taski/tasks/data/TaskType"
import { parseJson, pipe, safeParse, string } from "valibot"

export async function getNextTask(): Promise<TaskType | null> {
  const proc = Bun.spawn(["taski", "tasks", "next", "--start", "now"], {
    stdio: ["pipe", "pipe", "pipe"],
  })

  const stdout = await new Response(proc.stdout).text()
  const stderr = await new Response(proc.stderr).text()
  const code = await proc.exited

  if (code !== 0) {
    throw new Error(`taski failed: ${stderr}`)
  }

  if (stdout.includes("No pending tasks found")) {
    return null
  }

  const schema = pipe(string(), parseJson(), taskSchema)
  const result = safeParse(schema, stdout)

  if (!result.success) {
    throw new Error(`Failed to parse task: ${JSON.stringify(result.issues)}`)
  }

  return result.output
}
