import { expect, test } from "bun:test"
import { parseTask, parseStory } from "@/cli/data/validators"

test("parseTask returns success for valid data", () => {
	const validTask = {
		id: "T-001",
		dir: "/home/david/Coding/project",
		title: "Test Task",
		description: "A test task",
		acceptanceCriteria: ["Criterion 1"],
		priority: 1,
		passes: false,
	}
	const result = parseTask(validTask)
	expect(result.success).toBe(true)
	if (result.success) {
		expect(result.data.id).toBe("T-001")
	}
})

test("parseTask returns failure for invalid data", () => {
	const invalidTask = {
		id: "T-001",
	}
	const result = parseTask(invalidTask)
	expect(result.success).toBe(false)
	if (!result.success) {
		expect(result.issues).toBeDefined()
	}
})

test("parseStory returns success for valid data", () => {
	const validStory = {
		title: "Test Story",
		introduction: "An introduction",
		goals: ["Goal 1"],
		userTasks: ["S-001"],
	}
	const result = parseStory(validStory)
	expect(result.success).toBe(true)
	if (result.success) {
		expect(result.data.title).toBe("Test Story")
	}
})

test("parseStory returns failure for invalid data", () => {
	const invalidStory = {
		title: "Test Story",
	}
	const result = parseStory(invalidStory)
	expect(result.success).toBe(false)
	if (!result.success) {
		expect(result.issues).toBeDefined()
	}
})
