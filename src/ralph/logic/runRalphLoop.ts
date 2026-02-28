import { buildPrompt } from "@/ralph/logic/buildPrompt"
import { getNextTask } from "@/ralph/logic/getNextTask"
import { runOpencode } from "@/ralph/logic/runOpencode"
import { configLoad } from "@/taski/config/configLoad"
import { taskUpdate } from "@/taski/tasks/logic/taskUpdate"
import ms from "ms"
import { execSync } from "node:child_process"
import type { RalphConfig } from "../data/RalphConfig"

export async function runRalphLoop(config: RalphConfig): Promise<void> {
  const loopStartTime = performance.now()
  let completedTasks = 0

  const totalCountRaw = execSync("taski tasks count", { encoding: "utf-8" })
  const totalCount = Number(totalCountRaw.trim())

  if (totalCount === 0) {
    console.log("No tasks found. Exiting.")
    return
  }

  for (let i = 1; i <= config.maxIterations; i++) {
    const task = await getNextTask()

    if (task === null) {
      console.log(`${i} / ${config.maxIterations}: No pending tasks found. Exiting.`)
      break
    }

    console.log(`${i} / ${totalCount} / ${config.maxIterations}: ${task.id} - ${task.title}`)

    const taskStartTime = performance.now()

    const prompt = await buildPrompt(task)

    if (config.verbose) {
      console.log(task)
      console.log(prompt)
    }

    await runOpencode(prompt)

    process.stdout.write(": completed")

    const taskEndTime = performance.now()
    const taskDuration = taskEndTime - taskStartTime

    const gitDiff = getGitDiff(task.projectPath)

    console.log(" - " + gitDiff + ", duration: " + ms(taskDuration))

    const configResult = await configLoad()
    if (configResult.success) {
      await taskUpdate(configResult.data, task.id, { gitDiff })
    }

    completedTasks++
  }

  const loopEndTime = performance.now()
  const loopDuration = loopEndTime - loopStartTime

  console.log("")
  console.log(`Ralph completed ${completedTasks} task${completedTasks !== 1 ? "s" : ""} in ${ms(loopDuration)}.`)
}

function getGitDiff(projectPath: string): string {
  if (typeof projectPath !== "string" || !projectPath || !projectPath.startsWith("/")) {
    return "No project path"
  }

  const gitDir = new URL(".git", "file://" + projectPath)
  if (!Bun.file(gitDir).exists()) {
    return "Not a git repository"
  }

  try {
    const gitDiffRaw = execSync("git diff --shortstat", { cwd: projectPath, encoding: "utf-8" })
    return gitDiffRaw.trim() || "No changes"
  } catch {
    return "No changes"
  }
}
