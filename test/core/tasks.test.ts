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
		story: "test-story.md",
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

test("taskFindNext returns first task with passes=false", () => {
	const next = taskFindNext()
	expect(next).not.toBeUndefined()
	expect(next!.passes).toBe(false)
	expect(next!.id).toBe("T-007")
})

test("taskFindNext returns undefined when all tasks pass", () => {
	const tasks = tasksRead()
	for (const task of tasks) {
		taskUpdate(task.id, { passes: true })
	}
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

test("taskCreate initializes task with new fields", () => {
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
	const result = taskCreate(newTask)
	expect(result.note).toBe("Initial note")
	expect(result.startedAt).toBe("2025-01-17T08:00:00.000Z")
	expect(result.endedAt).toBeUndefined()
})
