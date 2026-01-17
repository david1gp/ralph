import { expect, test } from "bun:test"
import { taskSchema, taskValidate } from "@/cli/data/taskValidate"
import { storySchema, storyValidate } from "@/cli/data/storyValidate"

test("taskSchema validates correct task data", () => {
	const validTask = {
		id: "T-001",
		dir: "/home/david/Coding/project",
		title: "Test Task",
		description: "A test task",
		acceptanceCriteria: ["Criterion 1", "Criterion 2"],
		priority: 1,
		passes: false,
		note: "Some notes",
	}
	expect(() => taskValidate(validTask)).not.toThrow()
})

test("taskSchema rejects missing required fields", () => {
	const invalidTask = {
		id: "T-001",
		dir: "/home/david/Coding/project",
		title: "Test Task",
	}
	expect(() => taskValidate(invalidTask)).toThrow()
})

test("taskSchema accepts passes as true or false", () => {
	const taskTrue = {
		id: "T-001",
		dir: "/home/david/Coding/project",
		title: "Test Task",
		description: "A test task",
		acceptanceCriteria: [],
		priority: 1,
		passes: true,
	}
	const taskFalse = {
		id: "T-001",
		dir: "/home/david/Coding/project",
		title: "Test Task",
		description: "A test task",
		acceptanceCriteria: [],
		priority: 1,
		passes: false,
	}
	expect(() => taskValidate(taskTrue)).not.toThrow()
	expect(() => taskValidate(taskFalse)).not.toThrow()
})

test("storySchema validates correct story data", () => {
	const validStory = {
		title: "Test Story",
		introduction: "An introduction",
		goals: ["Goal 1", "Goal 2"],
		userTasks: ["S-001", "S-002"],
	}
	expect(() => storyValidate(validStory)).not.toThrow()
})

test("storySchema rejects missing required fields", () => {
	const invalidStory = {
		title: "Test Story",
		introduction: "An introduction",
	}
	expect(() => storyValidate(invalidStory)).toThrow()
})
