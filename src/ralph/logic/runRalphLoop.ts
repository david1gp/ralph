import { buildPrompt } from "@/ralph/logic/buildPrompt"
import { getNextTask } from "@/ralph/logic/getNextTask"
import { runOpencode } from "@/ralph/logic/runOpencode"
import type { RalphConfig } from "../data/RalphConfig"

export async function runRalphLoop(config: RalphConfig): Promise<void> {
  console.log(`Starting Ralph - Max iterations: ${config.maxIterations}`)

  for (let i = 1; i <= config.maxIterations; i++) {
    console.log("")
    console.log("═══════════════════════════════════════════════════════")
    console.log(`  Ralph Iteration ${i} of ${config.maxIterations}`)
    console.log("═══════════════════════════════════════════════════════")

    const task = await getNextTask()

    if (task === null) {
      console.log("No pending tasks found. Exiting.")
      return
    }

    const prompt = await buildPrompt(task)

    if (config.verbose) {
      console.log(`$ taski tasks next`)
      console.log(`Task: ${task.id} - ${task.title}`)
      console.log(task)
      console.log(prompt)
    }

    if (config.verbose) {
      console.log(`$ opencode run "..."`)
    }

    await runOpencode(prompt)

    console.log(`Iteration ${i} complete. Continuing...`)
  }

  console.log("")
  console.log(`Ralph reached max iterations (${config.maxIterations}).`)
}
