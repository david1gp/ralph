#!/usr/bin/env bun
import { taskiCommand } from "@/cli/cmd/taskiCommand"
import { run } from "@stricli/core"

try {
	await run(taskiCommand, process.argv.slice(2), { process })
} catch (error) {
	if (error instanceof Error && error.message.startsWith("{")) {
		console.error(error.message)
		process.exit(1)
	}
	throw error
}
