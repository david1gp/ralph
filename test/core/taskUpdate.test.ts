import { tasksRead } from "@/cli/core/tasksRead"
import { taskUpdate } from "@/cli/core/taskUpdate"
import { afterAll, beforeAll, beforeEach, expect, test } from "bun:test"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import type { Result } from "~utils/result/Result"

function assertOk<T>(result: Result<T>): asserts result is Extract<typeof result, { success: true }> {
	if (!result.success) {
		throw new Error(`Expected success but got error: ${result.errorMessage}`)
	}
}

function assertErr<T>(result: Result<T>): asserts result is Extract<typeof result, { success: false }> {
	if (result.success) {
		throw new Error(`Expected error but got success`)
	}
}

const originalTasksPath = "/home/david/Coding/personal-taski-cli/.taski/tasks.json"

const originalContent: string = readFileSync(originalTasksPath, "utf-8")

beforeAll(() => {
	if (!existsSync(originalTasksPath)) {
		throw new Error(`Tasks file not found at ${originalTasksPath}`)
	}
})

afterAll(() => {
	writeFileSync(originalTasksPath, originalContent)
})

beforeEach(() => {
	writeFileSync(originalTasksPath, originalContent)
})

test("taskUpdate updates existing task", async () => {
	const result = await taskUpdate("T-004", { title: "Updated Title", passes: true })
	expect(result.success).toBe(true)
	assertOk(result)
	const updated = result.data
	expect(updated.id).toBe("T-004")
	expect(updated.title).toBe("Updated Title")
	expect(updated.passes).toBe(true)
	const tasksResult = await tasksRead()
	expect(tasksResult.success).toBe(true)
	assertOk(tasksResult)
	const tasks = tasksResult.data
	const found = tasks.find((t) => t.id === "T-004")
	expect(found!.title).toBe("Updated Title")
	expect(found!.passes).toBe(true)
})

test("taskUpdate returns error for non-existent task", async () => {
	const result = await taskUpdate("NON-EXISTENT", { title: "Test" })
	expect(result.success).toBe(false)
	assertErr(result)
	expect(result.errorMessage).toContain('Task with id "NON-EXISTENT" not found')
})

test("taskUpdate sets startedAt field", async () => {
	const result = await taskUpdate("T-001", { startedAt: "2025-01-17T10:00:00.000Z" })
	expect(result.success).toBe(true)
	assertOk(result)
	expect(result.data.startedAt).toBe("2025-01-17T10:00:00.000Z")
	const tasksResult = await tasksRead()
	expect(tasksResult.success).toBe(true)
	assertOk(tasksResult)
	const tasks = tasksResult.data
	const found = tasks.find((t) => t.id === "T-001")
	expect(found!.startedAt).toBe("2025-01-17T10:00:00.000Z")
})

test("taskUpdate sets endedAt field", async () => {
	const result = await taskUpdate("T-002", { endedAt: "2025-01-17T12:00:00.000Z" })
	expect(result.success).toBe(true)
	assertOk(result)
	expect(result.data.endedAt).toBe("2025-01-17T12:00:00.000Z")
	const tasksResult = await tasksRead()
	expect(tasksResult.success).toBe(true)
	assertOk(tasksResult)
	const tasks = tasksResult.data
	const found = tasks.find((t) => t.id === "T-002")
	expect(found!.endedAt).toBe("2025-01-17T12:00:00.000Z")
})

test("taskUpdate sets note field", async () => {
	const result = await taskUpdate("T-003", { note: "Test note content" })
	expect(result.success).toBe(true)
	assertOk(result)
	expect(result.data.note).toBe("Test note content")
	const tasksResult = await tasksRead()
	expect(tasksResult.success).toBe(true)
	assertOk(tasksResult)
	const tasks = tasksResult.data
	const found = tasks.find((t) => t.id === "T-003")
	expect(found!.note).toBe("Test note content")
})

test("taskUpdate clears startedAt field when set to undefined", async () => {
	await taskUpdate("T-001", { startedAt: "2025-01-17T10:00:00.000Z" })
	const result = await taskUpdate("T-001", { startedAt: undefined })
	expect(result.success).toBe(true)
	assertOk(result)
	expect(result.data.startedAt).toBeUndefined()
	const tasksResult = await tasksRead()
	expect(tasksResult.success).toBe(true)
	assertOk(tasksResult)
	const tasks = tasksResult.data
	const found = tasks.find((t) => t.id === "T-001")
	expect(found!.startedAt).toBeUndefined()
})

test("taskUpdate clears endedAt field when set to undefined", async () => {
	await taskUpdate("T-002", { endedAt: "2025-01-17T12:00:00.000Z" })
	const result = await taskUpdate("T-002", { endedAt: undefined })
	expect(result.success).toBe(true)
	assertOk(result)
	expect(result.data.endedAt).toBeUndefined()
	const tasksResult = await tasksRead()
	expect(tasksResult.success).toBe(true)
	assertOk(tasksResult)
	const tasks = tasksResult.data
	const found = tasks.find((t) => t.id === "T-002")
	expect(found!.endedAt).toBeUndefined()
})

test("taskUpdate clears note field when set to undefined", async () => {
	await taskUpdate("T-003", { note: "Test note content" })
	const result = await taskUpdate("T-003", { note: undefined })
	expect(result.success).toBe(true)
	assertOk(result)
	expect(result.data.note).toBeUndefined()
	const tasksResult = await tasksRead()
	expect(tasksResult.success).toBe(true)
	assertOk(tasksResult)
	const tasks = tasksResult.data
	const found = tasks.find((t) => t.id === "T-003")
	expect(found!.note).toBeUndefined()
})

test("taskUpdate updates multiple fields at once", async () => {
	const result = await taskUpdate("T-005", {
		note: "Updated note",
		startedAt: "2025-01-17T09:00:00.000Z",
		endedAt: "2025-01-17T17:00:00.000Z",
	})
	expect(result.success).toBe(true)
	assertOk(result)
	const updated = result.data
	expect(updated.note).toBe("Updated note")
	expect(updated.startedAt).toBe("2025-01-17T09:00:00.000Z")
	expect(updated.endedAt).toBe("2025-01-17T17:00:00.000Z")
})

test("taskUpdate updates title field", async () => {
	const result = await taskUpdate("T-001", { title: "New Title" })
	expect(result.success).toBe(true)
	assertOk(result)
	expect(result.data.title).toBe("New Title")
	const tasksResult = await tasksRead()
	expect(tasksResult.success).toBe(true)
	assertOk(tasksResult)
	const tasks = tasksResult.data
	const found = tasks.find((t) => t.id === "T-001")
	expect(found!.title).toBe("New Title")
})

test("taskUpdate clears title field when set to empty string", async () => {
	const result = await taskUpdate("T-001", { title: "" })
	expect(result.success).toBe(true)
	assertOk(result)
	expect(result.data.title).toBe("")
	const tasksResult = await tasksRead()
	expect(tasksResult.success).toBe(true)
	assertOk(tasksResult)
	const tasks = tasksResult.data
	const found = tasks.find((t) => t.id === "T-001")
	expect(found!.title).toBe("")
})

test("taskUpdate updates description field", async () => {
	const result = await taskUpdate("T-002", { description: "New description" })
	expect(result.success).toBe(true)
	assertOk(result)
	expect(result.data.description).toBe("New description")
	const tasksResult = await tasksRead()
	expect(tasksResult.success).toBe(true)
	assertOk(tasksResult)
	const tasks = tasksResult.data
	const found = tasks.find((t) => t.id === "T-002")
	expect(found!.description).toBe("New description")
})

test("taskUpdate clears description field when set to empty string", async () => {
	const result = await taskUpdate("T-002", { description: "" })
	expect(result.success).toBe(true)
	assertOk(result)
	expect(result.data.description).toBe("")
	const tasksResult = await tasksRead()
	expect(tasksResult.success).toBe(true)
	assertOk(tasksResult)
	const tasks = tasksResult.data
	const found = tasks.find((t) => t.id === "T-002")
	expect(found!.description).toBe("")
})

test("taskUpdate sets acceptanceCriteria from JSON array", async () => {
	const result = await taskUpdate("T-003", { acceptanceCriteria: ["Test 1", "Test 2", "Test 3"] })
	expect(result.success).toBe(true)
	assertOk(result)
	expect(result.data.acceptanceCriteria).toEqual(["Test 1", "Test 2", "Test 3"])
	const tasksResult = await tasksRead()
	expect(tasksResult.success).toBe(true)
	assertOk(tasksResult)
	const tasks = tasksResult.data
	const found = tasks.find((t) => t.id === "T-003")
	expect(found!.acceptanceCriteria).toEqual(["Test 1", "Test 2", "Test 3"])
})

test("taskUpdate clears acceptanceCriteria when set to empty array", async () => {
	const result = await taskUpdate("T-003", { acceptanceCriteria: [] })
	expect(result.success).toBe(true)
	assertOk(result)
	expect(result.data.acceptanceCriteria).toEqual([])
	const tasksResult = await tasksRead()
	expect(tasksResult.success).toBe(true)
	assertOk(tasksResult)
	const tasks = tasksResult.data
	const found = tasks.find((t) => t.id === "T-003")
	expect(found!.acceptanceCriteria).toEqual([])
})

test("taskUpdate updates priority field", async () => {
	const result = await taskUpdate("T-004", { priority: 42 })
	expect(result.success).toBe(true)
	assertOk(result)
	expect(result.data.priority).toBe(42)
	const tasksResult = await tasksRead()
	expect(tasksResult.success).toBe(true)
	assertOk(tasksResult)
	const tasks = tasksResult.data
	const found = tasks.find((t) => t.id === "T-004")
	expect(found!.priority).toBe(42)
})

test("taskUpdate updates all fields at once", async () => {
	const result = await taskUpdate("T-005", {
		title: "Completely Updated",
		description: "Full task overhaul",
		acceptanceCriteria: ["New criterion 1", "New criterion 2"],
		priority: 99,
		passes: true,
		note: "All fields updated",
		startedAt: "2025-01-17T08:00:00.000Z",
		endedAt: "2025-01-17T18:00:00.000Z",
	})
	expect(result.success).toBe(true)
	assertOk(result)
	const updated = result.data
	expect(updated.title).toBe("Completely Updated")
	expect(updated.description).toBe("Full task overhaul")
	expect(updated.acceptanceCriteria).toEqual(["New criterion 1", "New criterion 2"])
	expect(updated.priority).toBe(99)
	expect(updated.passes).toBe(true)
	expect(updated.note).toBe("All fields updated")
	expect(updated.startedAt).toBe("2025-01-17T08:00:00.000Z")
	expect(updated.endedAt).toBe("2025-01-17T18:00:00.000Z")
})
