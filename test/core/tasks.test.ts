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
		notes: "",
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
