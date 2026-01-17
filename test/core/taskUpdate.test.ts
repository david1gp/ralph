import { expect, test, beforeAll, afterAll, beforeEach } from "bun:test"
import { writeFileSync, readFileSync, rmSync, existsSync } from "node:fs"
import { tasksRead } from "@/cli/core/tasksRead"
import { taskUpdate } from "@/cli/core/taskUpdate"
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

test("taskUpdate updates title field", () => {
	const updated = taskUpdate("T-001", { title: "New Title" })
	expect(updated.title).toBe("New Title")
	const tasks = tasksRead()
	const found = tasks.find((t) => t.id === "T-001")
	expect(found!.title).toBe("New Title")
})

test("taskUpdate clears title field when set to empty string", () => {
	const updated = taskUpdate("T-001", { title: "" })
	expect(updated.title).toBe("")
	const tasks = tasksRead()
	const found = tasks.find((t) => t.id === "T-001")
	expect(found!.title).toBe("")
})

test("taskUpdate updates description field", () => {
	const updated = taskUpdate("T-002", { description: "New description" })
	expect(updated.description).toBe("New description")
	const tasks = tasksRead()
	const found = tasks.find((t) => t.id === "T-002")
	expect(found!.description).toBe("New description")
})

test("taskUpdate clears description field when set to empty string", () => {
	const updated = taskUpdate("T-002", { description: "" })
	expect(updated.description).toBe("")
	const tasks = tasksRead()
	const found = tasks.find((t) => t.id === "T-002")
	expect(found!.description).toBe("")
})

test("taskUpdate sets acceptanceCriteria from JSON array", () => {
	const updated = taskUpdate("T-003", { acceptanceCriteria: ["Test 1", "Test 2", "Test 3"] })
	expect(updated.acceptanceCriteria).toEqual(["Test 1", "Test 2", "Test 3"])
	const tasks = tasksRead()
	const found = tasks.find((t) => t.id === "T-003")
	expect(found!.acceptanceCriteria).toEqual(["Test 1", "Test 2", "Test 3"])
})

test("taskUpdate clears acceptanceCriteria when set to empty array", () => {
	const updated = taskUpdate("T-003", { acceptanceCriteria: [] })
	expect(updated.acceptanceCriteria).toEqual([])
	const tasks = tasksRead()
	const found = tasks.find((t) => t.id === "T-003")
	expect(found!.acceptanceCriteria).toEqual([])
})

test("taskUpdate updates priority field", () => {
	const updated = taskUpdate("T-004", { priority: 42 })
	expect(updated.priority).toBe(42)
	const tasks = tasksRead()
	const found = tasks.find((t) => t.id === "T-004")
	expect(found!.priority).toBe(42)
})

test("taskUpdate updates all fields at once", () => {
	const updated = taskUpdate("T-005", {
		title: "Completely Updated",
		description: "Full task overhaul",
		acceptanceCriteria: ["New criterion 1", "New criterion 2"],
		priority: 99,
		passes: true,
		note: "All fields updated",
		startedAt: "2025-01-17T08:00:00.000Z",
		endedAt: "2025-01-17T18:00:00.000Z",
	})
	expect(updated.title).toBe("Completely Updated")
	expect(updated.description).toBe("Full task overhaul")
	expect(updated.acceptanceCriteria).toEqual(["New criterion 1", "New criterion 2"])
	expect(updated.priority).toBe(99)
	expect(updated.passes).toBe(true)
	expect(updated.note).toBe("All fields updated")
	expect(updated.startedAt).toBe("2025-01-17T08:00:00.000Z")
	expect(updated.endedAt).toBe("2025-01-17T18:00:00.000Z")
})
