import { expect, test, beforeAll, afterAll, beforeEach, beforeEach as beforeEachHook } from "bun:test"
import { writeFileSync, readFileSync, rmSync, existsSync } from "node:fs"
import { tasksRead } from "@/cli/core/tasksRead"
import { taskCreate } from "@/cli/core/taskCreate"
import { taskUpdate } from "@/cli/core/taskUpdate"
import { taskFindNext } from "@/cli/core/taskFindNext"
import { taskDelete } from "@/cli/core/taskDelete"
import type { Task } from "@/cli/data/TaskType"

const originalTasksPath = "/home/david/Coding/personal-taski-cli/.taski/tasks.json"
const originalContent: string = readFileSync(originalTasksPath, "utf-8")

beforeAll(() => {
	if (!existsSync("/home/david/Coding/personal-taski-cli/.taski")) {
		throw new Error(".taski directory does not exist")
	}
})

afterAll(() => {
	writeFileSync(originalTasksPath, originalContent)
})

beforeEachHook(() => {
	writeFileSync(originalTasksPath, originalContent)
})

test("tasksRead returns all tasks from tasks.json", async () => {
	const tasks = await tasksRead()
	expect(tasks.length).toBe(10)
	expect(tasks[0]!.id).toBe("T-001")
	expect(tasks[1]!.id).toBe("T-002")
	expect(tasks[3]!.id).toBe("T-004")
})

test("tasksRead returns empty array when file does not exist", async () => {
	rmSync(originalTasksPath, { force: true })
	const tasks = await tasksRead()
	expect(tasks).toEqual([])
	writeFileSync(originalTasksPath, originalContent)
})

test("taskCreate appends new task to tasks array", async () => {
	const initialTasks = await tasksRead()
	const initialCount = initialTasks.length
	const newTask: Task = {
		id: "T-NEW",
		dir: "/home/david/Coding/test",
		story: "test-story.md",
		title: "New Task",
		description: "Newly created task",
		acceptanceCriteria: ["Test"],
		priority: 99,
		passes: false,
		note: "",
	}
	const result = await taskCreate(newTask)
	expect(result.id).toBe("T-NEW")
	const tasks = await tasksRead()
	expect(tasks.length).toBe(initialCount + 1)
	expect(tasks[tasks.length - 1]!.id).toBe("T-NEW")
})

test("taskFindNext returns first task with passes=false", async () => {
	const next = await taskFindNext()
	expect(next).not.toBeUndefined()
	expect(next!.passes).toBe(false)
	expect(next!.id).toBe("T-007")
})

test("taskFindNext returns undefined when all tasks pass", async () => {
	const tasks = await tasksRead()
	for (const task of tasks) {
		await taskUpdate(task.id, { passes: true })
	}
	const next = await taskFindNext()
	expect(next).toBeUndefined()
})

test("taskDelete removes task by ID", async () => {
	const initialTasks = await tasksRead()
	const initialCount = initialTasks.length
	const result = await taskDelete("T-004")
	expect(result).toBe(true)
	const tasks = await tasksRead()
	expect(tasks.length).toBe(initialCount - 1)
	expect(tasks.find((t) => t.id === "T-004")).toBeUndefined()
})

test("taskDelete returns false for non-existent task", async () => {
	const result = await taskDelete("NON-EXISTENT")
	expect(result).toBe(false)
})

test("taskCreate initializes task with new fields", async () => {
	const newTask: Task = {
		id: "T-CREATE-TEST",
		dir: "/home/david/Coding/test",
		story: "test-story.md",
		title: "Create Test Task",
		description: "A task to test creation",
		acceptanceCriteria: ["Test"],
		priority: 100,
		passes: false,
		note: "Initial note",
		startedAt: "2025-01-17T08:00:00.000Z",
		endedAt: undefined,
	}
	const result = await taskCreate(newTask)
	expect(result.note).toBe("Initial note")
	expect(result.startedAt).toBe("2025-01-17T08:00:00.000Z")
	expect(result.endedAt).toBeUndefined()
})
