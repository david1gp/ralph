import { expect, test, beforeAll, afterAll, beforeEach } from "bun:test"
import { tasksRead } from "@/cli/core/tasksRead"
import { writeFileSync, readFileSync, rmSync, existsSync } from "node:fs"

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
