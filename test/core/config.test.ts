import { expect, test, beforeAll, afterAll } from "bun:test"
import { writeFileSync, rmSync, readFileSync } from "node:fs"
import { getTasksFilePath, getStoriesFolderPath, getConfig } from "@/cli/core/config"

const testEnvPath = ".env.test"
const originalEnvPath = ".env"

test("getTasksFilePath returns correct path from .env", () => {
	expect(getTasksFilePath()).toBe("/home/david/Coding/personal-taski-cli/tasks/tasks.json")
})

test("getStoriesFolderPath returns correct path from .env", () => {
	expect(getStoriesFolderPath()).toBe("/home/david/Coding/personal-taski-cli/stories")
})

test("getConfig returns both values", () => {
	const config = getConfig()
	expect(config.tasksFile).toBe("/home/david/Coding/personal-taski-cli/tasks/tasks.json")
	expect(config.storiesFolder).toBe("/home/david/Coding/personal-taski-cli/stories")
})

test("throws error when .env file is missing", () => {
	rmSync(originalEnvPath, { force: true })
	expect(() => getTasksFilePath()).toThrow(".env file not found")
	expect(() => getStoriesFolderPath()).toThrow(".env file not found")
	expect(() => getConfig()).toThrow(".env file not found")
	writeFileSync(originalEnvPath, readFileSync(testEnvPath, "utf-8"))
})

test("throws error when TASKI_TASKS_FILE is missing from .env", () => {
	const missingContent = "TASKI_STORIES_FOLDER=/home/david/Coding/test\n"
	writeFileSync(originalEnvPath, missingContent)
	expect(() => getTasksFilePath()).toThrow("TASKI_TASKS_FILE not found")
	writeFileSync(originalEnvPath, readFileSync(testEnvPath, "utf-8"))
})

test("throws error when TASKI_STORIES_FOLDER is missing from .env", () => {
	const missingContent = "TASKI_TASKS_FILE=/home/david/Coding/test/tasks.json\n"
	writeFileSync(originalEnvPath, missingContent)
	expect(() => getStoriesFolderPath()).toThrow("TASKI_STORIES_FOLDER not found")
	writeFileSync(originalEnvPath, readFileSync(testEnvPath, "utf-8"))
})
