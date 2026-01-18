#!/usr/bin/env bun
import { taskiCommand } from "@/cli/cmd/taskiCommand"
import { run } from "@stricli/core"
import { setConfigPath } from "@/cli/core/configStore"

function processConfigFlag(args: string[]): string[] {
	const configArg = args.find(arg => arg === "--config" || arg.startsWith("--config="))
	if (!configArg) {
		return args
	}

	if (configArg.startsWith("--config=")) {
		const value = configArg.split("=")[1]
		if (value) {
			setConfigPath(value)
		}
		return args.filter(arg => arg !== configArg)
	}

	const configIndex = args.indexOf("--config")
	const value = args[configIndex + 1]
	if (value && !value.startsWith("-")) {
		setConfigPath(value)
		return args.filter((_, i) => i !== configIndex && i !== configIndex + 1)
	}

	return args
}

const processedArgs = processConfigFlag(process.argv.slice(2))
await run(taskiCommand, processedArgs, { process })
