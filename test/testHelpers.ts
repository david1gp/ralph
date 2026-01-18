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
    "id": "T-001",
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
    "id": "T-002",
    "dir": "/home/david/Coding/personal-taski-cli",
    "story": "/home/david/Coding/personal-taski-cli/.taski/stories/test-story-2.md",
    "priority": 2,
    "passes": false,
    "title": "Task 2",
    "description": "Description for task 2",
    "acceptanceCriteria": ["Criterion 2"],
    "note": ""
  },
  {
    "id": "T-003",
    "dir": "/home/david/Coding/personal-taski-cli",
    "story": "/home/david/Coding/personal-taski-cli/.taski/stories/test-story-3.md",
    "priority": 3,
    "passes": false,
    "title": "Task 3",
    "description": "Description for task 3",
    "acceptanceCriteria": ["Criterion 3"],
    "note": ""
  },
  {
    "id": "T-004",
    "dir": "/home/david/Coding/personal-taski-cli",
    "story": "/home/david/Coding/personal-taski-cli/.taski/stories/test-story-4.md",
    "priority": 4,
    "passes": false,
    "title": "Task 4",
    "description": "Description for task 4",
    "acceptanceCriteria": ["Criterion 4"],
    "note": ""
  },
  {
    "id": "T-005",
    "dir": "/home/david/Coding/personal-taski-cli",
    "story": "/home/david/Coding/personal-taski-cli/.taski/stories/test-story-5.md",
    "priority": 5,
    "passes": false,
    "title": "Task 5",
    "description": "Description for task 5",
    "acceptanceCriteria": ["Criterion 5"],
    "note": ""
  },
  {
    "id": "T-006",
    "dir": "/home/david/Coding/personal-taski-cli",
    "story": "/home/david/Coding/personal-taski-cli/.taski/stories/test-story-6.md",
    "priority": 6,
    "passes": false,
    "title": "Task 6",
    "description": "Description for task 6",
    "acceptanceCriteria": ["Criterion 6"],
    "note": ""
  },
  {
    "id": "T-007",
    "dir": "/home/david/Coding/personal-taski-cli",
    "story": "/home/david/Coding/personal-taski-cli/.taski/stories/test-story-7.md",
    "priority": 7,
    "passes": false,
    "title": "Task 7",
    "description": "Description for task 7",
    "acceptanceCriteria": ["Criterion 7"],
    "note": ""
  },
  {
    "id": "T-008",
    "dir": "/home/david/Coding/personal-taski-cli",
    "story": "/home/david/Coding/personal-taski-cli/.taski/stories/test-story-8.md",
    "priority": 8,
    "passes": false,
    "title": "Task 8",
    "description": "Description for task 8",
    "acceptanceCriteria": ["Criterion 8"],
    "note": ""
  },
  {
    "id": "T-009",
    "dir": "/home/david/Coding/personal-taski-cli",
    "story": "/home/david/Coding/personal-taski-cli/.taski/stories/test-story-9.md",
    "priority": 9,
    "passes": false,
    "title": "Task 9",
    "description": "Description for task 9",
    "acceptanceCriteria": ["Criterion 9"],
    "note": ""
  },
  {
    "id": "T-010",
    "dir": "/home/david/Coding/personal-taski-cli",
    "story": "/home/david/Coding/personal-taski-cli/.taski/stories/test-story-10.md",
    "priority": 10,
    "passes": false,
    "title": "Task 10",
    "description": "Description for task 10",
    "acceptanceCriteria": ["Criterion 10"],
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
		projectTaskPrefix: {},
		projectTaskIdNumber: {},
		testing: true,
	}
}
