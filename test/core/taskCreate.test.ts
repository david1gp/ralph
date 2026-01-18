import { expect, test, beforeAll, afterAll, beforeEach } from "bun:test"
import { taskCreate } from "@/cli/core/taskCreate"
import { tasksRead } from "@/cli/core/tasksRead"
import { writeFileSync, readFileSync, existsSync } from "node:fs"
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

beforeEach(() => {
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
