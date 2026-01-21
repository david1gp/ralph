import { buildPrompt } from "@/ralph/logic/buildPrompt"
import { getNextTask } from "@/ralph/logic/getNextTask"
import { runOpencode } from "@/ralph/logic/runOpencode"
import type { RalphConfig } from "../data/RalphConfig"

export async function runRalphLoop(config: RalphConfig): Promise<void> {
  for (let i = 1; i <= config.maxIterations; i++) {

    const task = await getNextTask()

    if (task === null) {
      console.log(`${i} / ${config.maxIterations}: No pending tasks found. Exiting.`)
      return
    } else {
      console.log(`${i} / ${config.maxIterations}: ${task.id} - ${task.title}`)
    }

    const prompt = await buildPrompt(task)

    if (config.verbose) {
      console.log(task)
      console.log(prompt)
    }

    await runOpencode(prompt)

    process.stdout.write(`: completed`)
  }

  console.log("")
  console.log(`Ralph reached max iterations (${config.maxIterations}).`)
}
