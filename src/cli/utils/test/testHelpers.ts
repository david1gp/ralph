import type { ConfigType } from "@/cli/config/ConfigType"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import type { Result } from "~utils/result/Result"

const __dirname = dirname(fileURLToPath(import.meta.url))
const testTaskiDir = join(__dirname, "..", ".taski")
export const projectRoot = join(__dirname, "..")

const originalTasksPath = join(testTaskiDir, "tasks.json")
let originalContent: string | null = null

function getDefaultTestTasks(): string {
  return `[
  {
    "id": "TEST-001",
    "projectPath": "${projectRoot}",
    "story": "${join(testTaskiDir, "stories", "test-story-1.md")}",
    "priority": 1,
    "passes": false,
    "title": "Task 1",
    "description": "Description for task 1",
    "acceptanceCriteria": ["Criterion 1"],
    "note": "",
    "startedAt": "2025-01-17T08:00:00.000Z",
    "endedAt": "2025-01-17T10:00:00.000Z",
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  {
    "id": "TEST-002",
    "projectPath": "${projectRoot}",
    "story": "${join(testTaskiDir, "stories", "test-story-2.md")}",
    "priority": 2,
    "passes": false,
    "title": "Task 2",
    "description": "Description for task 2",
    "acceptanceCriteria": ["Criterion 2"],
    "note": "",
    "startedAt": "2025-02-15T08:00:00.000Z",
    "createdAt": "2025-02-01T00:00:00.000Z"
  }
]`
}

export function testBeforeAll(): void {
  if (!existsSync(testTaskiDir)) {
    throw new Error(`.taski directory does not exist: ${testTaskiDir}`)
  }
  if (!existsSync(originalTasksPath)) {
    writeFileSync(originalTasksPath, getDefaultTestTasks())
  }
  originalContent = readFileSync(originalTasksPath, "utf-8")
}

export function testAfterAll(): void {
  if (originalContent && existsSync(originalTasksPath)) {
    writeFileSync(originalTasksPath, originalContent)
  }
}

export function resetTasksFile(): void {
  if (originalContent && existsSync(originalTasksPath)) {
    writeFileSync(originalTasksPath, originalContent)
  }
}

export function assertOk<T>(result: Result<T>): asserts result is Extract<typeof result, { success: true }> {
  if (!result.success) {
    throw new Error(`Expected success but got error: ${result.errorMessage}`)
  }
}

export function assertErr<T>(result: Result<T>): asserts result is Extract<typeof result, { success: false }> {
  if (result.success) {
    throw new Error(`Expected error but got success`)
  }
}

export function getTestConfig(overrides: Partial<ConfigType> = {}): ConfigType {
  const base: ConfigType = {
    tasksFile: join(testTaskiDir, "tasks.json"),
    tasksArchivedDir: join(testTaskiDir, "tasks-archive"),
    storiesFolder: join(testTaskiDir, "stories"),
    projectTaskPrefix: { [projectRoot]: "TEST" },
    projectTaskIdNumber: {},
    storyIdNumber: 0,
    projectStoryIdNumber: {},
    testing: true,
  }
  return { ...base, ...overrides }
}
