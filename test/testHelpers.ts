import { setConfigPath, clearConfigPath } from "@/cli/core/configStore"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import type { ConfigType } from "@/cli/data/ConfigType"

const __dirname = dirname(fileURLToPath(import.meta.url))
const testTaskiDir = join(__dirname, ".taski")

const originalTasksPath = join(testTaskiDir, "tasks.json")
let originalContent: string | null = null

const defaultTestTasks = `[
  {
    "id": "TEST-001",
    "dir": "/home/david/Coding/personal-taski-cli",
    "story": "/home/david/Coding/personal-taski-cli/.taski/stories/test-story-1.md",
    "priority": 1,
    "passes": false,
    "title": "Task 1",
    "description": "Description for task 1",
    "acceptanceCriteria": ["Criterion 1"],
    "note": ""
  },
  {
    "id": "TEST-002",
    "dir": "/home/david/Coding/personal-taski-cli",
    "story": "/home/david/Coding/personal-taski-cli/.taski/stories/test-story-2.md",
    "priority": 2,
    "passes": false,
    "title": "Task 2",
    "description": "Description for task 2",
    "acceptanceCriteria": ["Criterion 2"],
    "note": ""
  }
]`

export function testBeforeAll(): void {
	if (!existsSync(testTaskiDir)) {
		throw new Error(`.taski directory does not exist: ${testTaskiDir}`)
	}
	setConfigPath(testTaskiDir)
	if (!existsSync(originalTasksPath)) {
		writeFileSync(originalTasksPath, defaultTestTasks)
	}
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

export function getTestConfig(): ConfigType {
	return {
		tasksFile: join(testTaskiDir, "tasks.json"),
		storiesFolder: join(testTaskiDir, "stories"),
		projectTaskPrefix: { "/home/david/Coding/personal-taski-cli": "TEST" },
		projectTaskIdNumber: {},
		testing: true,
	}
}
