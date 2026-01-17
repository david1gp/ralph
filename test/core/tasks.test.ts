import { expect, test, beforeAll, afterAll, beforeEach } from "bun:test"
import { writeFileSync, readFileSync, rmSync, existsSync } from "node:fs"
import { readTasks } from "@/cli/core/readTasks"
import { createTask } from "@/cli/core/createTask"
import { updateTask } from "@/cli/core/updateTask"
import { findNextTask } from "@/cli/core/findNextTask"
import { deleteTask } from "@/cli/core/deleteTask"
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

test("readTasks returns all tasks from tasks.json", () => {
	const tasks = readTasks()
	expect(tasks.length).toBe(10)
	expect(tasks[0]!.id).toBe("T-001")
	expect(tasks[1]!.id).toBe("T-002")
	expect(tasks[3]!.id).toBe("T-004")
})

test("readTasks returns empty array when file does not exist", () => {
	rmSync(originalTasksPath, { force: true })
	const tasks = readTasks()
	expect(tasks).toEqual([])
})

test("createTask appends new task to tasks array", () => {
	const initialTasks = readTasks()
	const initialCount = initialTasks.length
	const newTask: Task = {
		id: "T-NEW",
		dir: "/home/david/Coding/test",
		title: "New Task",
		description: "Newly created task",
		acceptanceCriteria: ["Test"],
		priority: 99,
		passes: false,
		notes: "",
	}
	const result = createTask(newTask)
	expect(result.id).toBe("T-NEW")
	const tasks = readTasks()
	expect(tasks.length).toBe(initialCount + 1)
	expect(tasks[tasks.length - 1]!.id).toBe("T-NEW")
})

test("updateTask updates existing task", () => {
	const updated = updateTask("T-004", { title: "Updated Title", passes: true })
	expect(updated.id).toBe("T-004")
	expect(updated.title).toBe("Updated Title")
	expect(updated.passes).toBe(true)
	const tasks = readTasks()
	const found = tasks.find((t) => t.id === "T-004")
	expect(found!.title).toBe("Updated Title")
	expect(found!.passes).toBe(true)
})

test("updateTask throws error for non-existent task", () => {
	expect(() => updateTask("NON-EXISTENT", { title: "Test" })).toThrow(
		'Task with id "NON-EXISTENT" not found',
	)
})

test("findNextTask returns first task with passes=false", () => {
	const next = findNextTask()
	expect(next).not.toBeUndefined()
	expect(next!.passes).toBe(false)
	expect(next!.id).toBe("T-007")
})

test("findNextTask returns undefined when all tasks pass", () => {
	updateTask("T-004", { passes: true })
	updateTask("T-005", { passes: true })
	updateTask("T-006", { passes: true })
	updateTask("T-007", { passes: true })
	updateTask("T-008", { passes: true })
	updateTask("T-009", { passes: true })
	updateTask("T-010", { passes: true })
	const next = findNextTask()
	expect(next).toBeUndefined()
})

test("deleteTask removes task by ID", () => {
	const initialTasks = readTasks()
	const initialCount = initialTasks.length
	const result = deleteTask("T-004")
	expect(result).toBe(true)
	const tasks = readTasks()
	expect(tasks.length).toBe(initialCount - 1)
	expect(tasks.find((t) => t.id === "T-004")).toBeUndefined()
})

test("deleteTask returns false for non-existent task", () => {
	const result = deleteTask("NON-EXISTENT")
	expect(result).toBe(false)
})
