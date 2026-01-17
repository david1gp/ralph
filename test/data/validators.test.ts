import { expect, test } from "bun:test"
import { taskParse } from "@/cli/data/taskParse"
import { storyParse } from "@/cli/data/storyParse"

test("taskParse returns success for valid data", () => {
	const validTask = {
		id: "T-001",
		dir: "/home/david/Coding/project",
		title: "Test Task",
		description: "A test task",
		acceptanceCriteria: ["Criterion 1"],
		priority: 1,
		passes: false,
	}
	const result = taskParse(validTask)
	expect(result.success).toBe(true)
	if (result.success) {
		expect(result.data.id).toBe("T-001")
	}
})

test("taskParse returns failure for invalid data", () => {
	const invalidTask = {
		id: "T-001",
	}
	const result = taskParse(invalidTask)
	expect(result.success).toBe(false)
	if (!result.success) {
		expect(result.issues).toBeDefined()
	}
})

test("storyParse returns success for valid data", () => {
	const validStory = {
		title: "Test Story",
		introduction: "An introduction",
		goals: ["Goal 1"],
		userTasks: ["S-001"],
	}
	const result = storyParse(validStory)
	expect(result.success).toBe(true)
	if (result.success) {
		expect(result.data.title).toBe("Test Story")
	}
})

test("storyParse returns failure for invalid data", () => {
	const invalidStory = {
		title: "Test Story",
	}
	const result = storyParse(invalidStory)
	expect(result.success).toBe(false)
	if (!result.success) {
		expect(result.issues).toBeDefined()
	}
})
