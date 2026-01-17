import { taskiCommand } from "@/cli/cmd/taskiCommand"
import { run } from "@stricli/core"

await run(taskiCommand, process.argv.slice(2), { process })
