import { configGet } from "@/cli/core/configGet"
import { storyFolderPathGet } from "@/cli/core/storyFolderPathGet"
import { taskFilePathGet } from "@/cli/core/taskFilePathGet"
import { expect, test } from "bun:test"
import { readFileSync, rmSync, writeFileSync } from "node:fs"

const testEnvPath = ".env.test"
const originalEnvPath = ".env"

test("tasksFilePathGet returns correct path from .env", () => {
	expect(taskFilePathGet()).toBe("/home/david/Coding/personal-taski-cli/tasks/tasks.json")
})

test("storiesFolderPathGet returns correct path from .env", () => {
	expect(storyFolderPathGet()).toBe("/home/david/Coding/personal-taski-cli/stories")
})

test("configGet returns both values", () => {
	const config = configGet()
	expect(config.tasksFile).toBe("/home/david/Coding/personal-taski-cli/tasks/tasks.json")
	expect(config.storiesFolder).toBe("/home/david/Coding/personal-taski-cli/stories")
})

test("throws error when .env file is missing", () => {
	rmSync(originalEnvPath, { force: true })
	expect(() => taskFilePathGet()).toThrow(".env file not found")
	expect(() => storyFolderPathGet()).toThrow(".env file not found")
	expect(() => configGet()).toThrow(".env file not found")
	writeFileSync(originalEnvPath, readFileSync(testEnvPath, "utf-8"))
})

test("throws error when TASKI_TASKS_FILE is missing from .env", () => {
	const missingContent = "TASKI_STORIES_FOLDER=/home/david/Coding/test\n"
	writeFileSync(originalEnvPath, missingContent)
	expect(() => taskFilePathGet()).toThrow("TASKI_TASKS_FILE not found")
	writeFileSync(originalEnvPath, readFileSync(testEnvPath, "utf-8"))
})

test("throws error when TASKI_STORIES_FOLDER is missing from .env", () => {
	const missingContent = "TASKI_TASKS_FILE=/home/david/Coding/test/tasks.json\n"
	writeFileSync(originalEnvPath, missingContent)
	expect(() => storyFolderPathGet()).toThrow("TASKI_STORIES_FOLDER not found")
	writeFileSync(originalEnvPath, readFileSync(testEnvPath, "utf-8"))
})
