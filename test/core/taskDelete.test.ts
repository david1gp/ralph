import { expect, test, beforeAll, afterAll, beforeEach } from "bun:test"
import { writeFileSync, readFileSync, existsSync } from "node:fs"
import { taskDelete } from "@/cli/core/taskDelete"
import { tasksRead } from "@/cli/core/tasksRead"

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
