import { run } from "@stricli/core"
import { rootCommand } from "@/cli/cmd/root"

await run(rootCommand, process.argv.slice(2), { process })
