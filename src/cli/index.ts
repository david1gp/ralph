import { run } from "@stricli/core"
import { rootCommand } from "@/cli/cmd/taskiCommand"

await run(rootCommand, process.argv.slice(2), { process })
