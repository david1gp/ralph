import { expect, test, beforeAll, afterAll, beforeEach } from "bun:test"
import { writeFileSync, readFileSync, rmSync, existsSync } from "node:fs"
import { tasksRead } from "@/cli/core/tasksRead"
import { taskCreate } from "@/cli/core/taskCreate"
import { taskUpdate } from "@/cli/core/taskUpdate"
import { taskFindNext } from "@/cli/core/taskFindNext"
import { taskDelete } from "@/cli/core/taskDelete"
import type { Task } from "@/cli/data/TaskType"

const testTasksPath = "/home/david/Coding/personal-taski-cli/tasks/tasks.test.json"
const originalTasksPath = "/home/david/Coding/personal-taski-cli/tasks/tasks.json"

const originalContent: string = readFileSync(originalTasksPath, "utf-8")

beforeAll(() => {
	if (existsSync(testTasksPath)) {
		rmSync(testTasksPath)
	}
})

afterAll(() => {
	if (existsSync(testTasksPath)) {
		rmSync(testTasksPath)
	}
	writeFileSync(originalTasksPath, originalContent)
})

beforeEach(() => {
	writeFileSync(originalTasksPath, originalContent)
})

test("tasksRead returns all tasks from tasks.json", () => {
	const tasks = tasksRead()
	expect(tasks.length).toBe(10)
	expect(tasks[0]!.id).toBe("T-001")
	expect(tasks[1]!.id).toBe("T-002")
	expect(tasks[3]!.id).toBe("T-004")
})

test("tasksRead returns empty array when file does not exist", () => {
	rmSync(originalTasksPath, { force: true })
	const tasks = tasksRead()
	expect(tasks).toEqual([])
})

test("taskCreate appends new task to tasks array", () => {
	const initialTasks = tasksRead()
	const initialCount = initialTasks.length
	const newTask: Task = {
		id: "T-NEW",
		dir: "/home/david/Coding/test",
		title: "New Task",
		description: "Newly created task",
		acceptanceCriteria: ["Test"],
		priority: 99,
		passes: false,
		note: "",
	}
	const result = taskCreate(newTask)
	expect(result.id).toBe("T-NEW")
	const tasks = tasksRead()
	expect(tasks.length).toBe(initialCount + 1)
	expect(tasks[tasks.length - 1]!.id).toBe("T-NEW")
})

test("taskUpdate updates existing task", () => {
	const updated = taskUpdate("T-004", { title: "Updated Title", passes: true })
	expect(updated.id).toBe("T-004")
	expect(updated.title).toBe("Updated Title")
	expect(updated.passes).toBe(true)
	const tasks = tasksRead()
	const found = tasks.find((t) => t.id === "T-004")
	expect(found!.title).toBe("Updated Title")
	expect(found!.passes).toBe(true)
})

test("taskUpdate throws error for non-existent task", () => {
	expect(() => taskUpdate("NON-EXISTENT", { title: "Test" })).toThrow(
		'Task with id "NON-EXISTENT" not found',
	)
})

test("taskFindNext returns first task with passes=false", () => {
	const next = taskFindNext()
	expect(next).not.toBeUndefined()
	expect(next!.passes).toBe(false)
	expect(next!.id).toBe("T-007")
})

test("taskFindNext returns undefined when all tasks pass", () => {
	taskUpdate("T-004", { passes: true })
	taskUpdate("T-005", { passes: true })
	taskUpdate("T-006", { passes: true })
	taskUpdate("T-007", { passes: true })
	taskUpdate("T-008", { passes: true })
	taskUpdate("T-009", { passes: true })
	taskUpdate("T-010", { passes: true })
	const next = taskFindNext()
	expect(next).toBeUndefined()
})

test("taskDelete removes task by ID", () => {
	const initialTasks = tasksRead()
	const initialCount = initialTasks.length
	const result = taskDelete("T-004")
	expect(result).toBe(true)
	const tasks = tasksRead()
	expect(tasks.length).toBe(initialCount - 1)
	expect(tasks.find((t) => t.id === "T-004")).toBeUndefined()
})

test("taskDelete returns false for non-existent task", () => {
	const result = taskDelete("NON-EXISTENT")
	expect(result).toBe(false)
})

test("taskUpdate sets startedAt field", () => {
	const updated = taskUpdate("T-001", { startedAt: "2025-01-17T10:00:00.000Z" })
	expect(updated.startedAt).toBe("2025-01-17T10:00:00.000Z")
	const tasks = tasksRead()
	const found = tasks.find((t) => t.id === "T-001")
	expect(found!.startedAt).toBe("2025-01-17T10:00:00.000Z")
})

test("taskUpdate sets endedAt field", () => {
	const updated = taskUpdate("T-002", { endedAt: "2025-01-17T12:00:00.000Z" })
	expect(updated.endedAt).toBe("2025-01-17T12:00:00.000Z")
	const tasks = tasksRead()
	const found = tasks.find((t) => t.id === "T-002")
	expect(found!.endedAt).toBe("2025-01-17T12:00:00.000Z")
})

test("taskUpdate sets note field", () => {
	const updated = taskUpdate("T-003", { note: "Test note content" })
	expect(updated.note).toBe("Test note content")
	const tasks = tasksRead()
	const found = tasks.find((t) => t.id === "T-003")
	expect(found!.note).toBe("Test note content")
})

test("taskUpdate clears startedAt field when set to undefined", () => {
	taskUpdate("T-001", { startedAt: "2025-01-17T10:00:00.000Z" })
	const updated = taskUpdate("T-001", { startedAt: undefined })
	expect(updated.startedAt).toBeUndefined()
	const tasks = tasksRead()
	const found = tasks.find((t) => t.id === "T-001")
	expect(found!.startedAt).toBeUndefined()
})

test("taskUpdate clears endedAt field when set to undefined", () => {
	taskUpdate("T-002", { endedAt: "2025-01-17T12:00:00.000Z" })
	const updated = taskUpdate("T-002", { endedAt: undefined })
	expect(updated.endedAt).toBeUndefined()
	const tasks = tasksRead()
	const found = tasks.find((t) => t.id === "T-002")
	expect(found!.endedAt).toBeUndefined()
})

test("taskUpdate clears note field when set to undefined", () => {
	taskUpdate("T-003", { note: "Test note content" })
	const updated = taskUpdate("T-003", { note: undefined })
	expect(updated.note).toBeUndefined()
	const tasks = tasksRead()
	const found = tasks.find((t) => t.id === "T-003")
	expect(found!.note).toBeUndefined()
})

test("taskCreate initializes task with new fields", () => {
	const newTask: Task = {
		id: "T-CREATE-TEST",
		dir: "/home/david/Coding/test",
		title: "Create Test Task",
		description: "A task to test creation",
		acceptanceCriteria: ["Test"],
		priority: 100,
		passes: false,
		note: "Initial note",
		startedAt: "2025-01-17T08:00:00.000Z",
		endedAt: undefined,
	}
	const result = taskCreate(newTask)
	expect(result.note).toBe("Initial note")
	expect(result.startedAt).toBe("2025-01-17T08:00:00.000Z")
	expect(result.endedAt).toBeUndefined()
})

test("taskUpdate updates multiple fields at once", () => {
	const updated = taskUpdate("T-005", {
		note: "Updated note",
		startedAt: "2025-01-17T09:00:00.000Z",
		endedAt: "2025-01-17T17:00:00.000Z",
	})
	expect(updated.note).toBe("Updated note")
	expect(updated.startedAt).toBe("2025-01-17T09:00:00.000Z")
	expect(updated.endedAt).toBe("2025-01-17T17:00:00.000Z")
})
