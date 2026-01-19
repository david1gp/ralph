import { taskArchive } from "@/cli/tasks/logic/archive/taskArchive"
import { tasksArchivedRead } from "@/cli/tasks/logic/archive/tasksArchivedRead"
import { tasksRead } from "@/cli/tasks/logic/tasksRead"
import { afterAll, beforeAll, beforeEach, expect, test } from "bun:test"
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { assertErr, assertOk, getTestConfig, testAfterAll, testBeforeAll } from "../../utils/test/testHelpers"

const testConfig = getTestConfig()
const testTaskiDir = join(__dirname, "..", "..", ".taski")
const archiveDir = testConfig.tasksArchivedDir
const tasksPath = join(testTaskiDir, "tasks.json")

const testTasksWithDates = [
  {
    id: "TEST-001",
    projectPath: testTaskiDir,
    story: join(testTaskiDir, "stories", "test-story-1.md"),
    priority: 1,
    passes: false,
    title: "Task 1",
    description: "Description for task 1",
    acceptanceCriteria: ["Criterion 1"],
    note: "",
    startedAt: "2025-01-17T08:00:00.000Z",
    endedAt: "2025-01-17T10:00:00.000Z",
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "TEST-002",
    projectPath: testTaskiDir,
    story: join(testTaskiDir, "stories", "test-story-2.md"),
    priority: 2,
    passes: false,
    title: "Task 2",
    description: "Description for task 2",
    acceptanceCriteria: ["Criterion 2"],
    note: "",
    startedAt: "2025-02-15T08:00:00.000Z",
    createdAt: "2025-02-01T00:00:00.000Z",
  },
]

const testTasksNoDates = [
  {
    id: "TEST-003",
    projectPath: testTaskiDir,
    story: join(testTaskiDir, "stories", "test-story-1.md"),
    priority: 3,
    passes: false,
    title: "Task 3",
    description: "Description for task 3",
    acceptanceCriteria: ["Criterion 3"],
    note: "",
  },
]

function writeTestTasks(tasks: unknown[]) {
  writeFileSync(tasksPath, JSON.stringify(tasks, null, 2))
}

beforeAll(() => {
  testBeforeAll()
})

afterAll(() => {
  testAfterAll()
})

beforeEach(() => {
  writeTestTasks(testTasksWithDates)
  if (existsSync(archiveDir)) {
    const files = require("fs").readdirSync(archiveDir)
    for (const file of files) {
      rmSync(join(archiveDir, file))
    }
  }
})

test("taskArchive returns error when task has no date field", async () => {
  writeTestTasks(testTasksNoDates)
  const result = await taskArchive(testConfig, "TEST-003")
  expect(result.success).toBe(false)
  assertErr(result)
  expect(result.errorMessage).toContain("no date field")
})

test("taskArchive moves task to archive with endedAt date", async () => {
  const archiveResult = await taskArchive(testConfig, "TEST-001")
  expect(archiveResult.success).toBe(true)
  assertOk(archiveResult)
  const archived = archiveResult.data
  expect(archived.id).toBe("TEST-001")
  expect(archived.passes).toBe(true)

  const tasksResult = await tasksRead(testConfig)
  expect(tasksResult.success).toBe(true)
  assertOk(tasksResult)
  const tasks = tasksResult.data
  expect(tasks.find((t) => t.id === "TEST-001")).toBeUndefined()
  expect(tasks.length).toBe(1)
  expect(tasks[0]!.id).toBe("TEST-002")

  const archivedResult = await tasksArchivedRead(testConfig, "2025-01")
  expect(archivedResult.success).toBe(true)
  assertOk(archivedResult)
  const archivedTasks = archivedResult.data
  expect(archivedTasks.length).toBe(1)
  expect(archivedTasks[0]!.id).toBe("TEST-001")
  expect(archivedTasks[0]!.passes).toBe(true)
})

test("taskArchive uses startedAt when endedAt is missing", async () => {
  const archiveResult = await taskArchive(testConfig, "TEST-002")
  expect(archiveResult.success).toBe(true)
  assertOk(archiveResult)

  const archived202502Result = await tasksArchivedRead(testConfig, "2025-02")
  expect(archived202502Result.success).toBe(true)
  assertOk(archived202502Result)
  expect(archived202502Result.data.length).toBe(1)
  expect(archived202502Result.data[0]!.id).toBe("TEST-002")
})

test("taskArchive returns error for non-existent task", async () => {
  const result = await taskArchive(testConfig, "NON-EXISTENT")
  expect(result.success).toBe(false)
  assertErr(result)
  expect(result.errorMessage).toContain('Task with id "NON-EXISTENT" not found')
})

test("taskArchive appends to existing month file", async () => {
  if (!existsSync(archiveDir)) {
    mkdirSync(archiveDir, { recursive: true })
  }
  writeFileSync(join(archiveDir, "2025-01.json"), JSON.stringify([{ id: "EXISTING-001", projectPath: "/test", story: "/test/story.md", priority: 1, passes: false, title: "Existing", description: "Existing task", acceptanceCriteria: [], note: "" }]))
  await taskArchive(testConfig, "TEST-001")

  const archivedResult = await tasksArchivedRead(testConfig, "2025-01")
  expect(archivedResult.success).toBe(true)
  assertOk(archivedResult)
  expect(archivedResult.data.length).toBe(2)
  expect(archivedResult.data[0]!.id).toBe("EXISTING-001")
  expect(archivedResult.data[1]!.id).toBe("TEST-001")
})

test("taskArchive creates archive directory if needed", async () => {
  rmSync(archiveDir, { recursive: true })
  expect(existsSync(archiveDir)).toBe(false)

  const archiveResult = await taskArchive(testConfig, "TEST-001")
  expect(archiveResult.success).toBe(true)
  assertOk(archiveResult)

  expect(existsSync(archiveDir)).toBe(true)
  const archivedFile = join(archiveDir, "2025-01.json")
  expect(existsSync(archivedFile)).toBe(true)
})
