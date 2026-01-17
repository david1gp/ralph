import { run } from "@stricli/core"
import { rootCommand } from "./cmd/root.js"

await run(rootCommand, process.argv.slice(2), { process })
