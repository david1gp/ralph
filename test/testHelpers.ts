import { setConfigPath, clearConfigPath } from "@/cli/core/configStore"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { existsSync, readFileSync, writeFileSync } from "node:fs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const testTaskiDir = join(__dirname, ".taski")

const originalTasksPath = join(testTaskiDir, "tasks.json")
let originalContent: string | null = null

export function testBeforeAll(): void {
	if (!existsSync(testTaskiDir)) {
		throw new Error(`.taski directory does not exist: ${testTaskiDir}`)
	}
	setConfigPath(testTaskiDir)
	originalContent = readFileSync(originalTasksPath, "utf-8")
}

export function testAfterAll(): void {
	clearConfigPath()
	if (originalContent && existsSync(originalTasksPath)) {
		writeFileSync(originalTasksPath, originalContent)
	}
}

export function resetTasksFile(): void {
	if (originalContent && existsSync(originalTasksPath)) {
		writeFileSync(originalTasksPath, originalContent)
	}
}

export function getTestConfig(): { tasksFile: string; storiesFolder: string } {
	return {
		tasksFile: join(testTaskiDir, "tasks.json"),
		storiesFolder: join(testTaskiDir, "stories"),
	}
}
