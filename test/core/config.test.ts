import { configGet } from "@/cli/core/configGet"
import { expect, test, beforeAll, afterAll } from "bun:test"
import { writeFileSync, rmSync, existsSync, mkdirSync } from "node:fs"
import { join } from "node:path"

const testTaskiDir = "/home/david/Coding/personal-taski-cli/.taski_test"
const testConfigPath = join(testTaskiDir, "taski.json")
const originalConfigPath = "/home/david/Coding/personal-taski-cli/.taski/taski.json"

const originalContent: string = "{\"tasksFile\":\"./tasks.json\",\"storiesFolder\":\"./stories\"}"

beforeAll(() => {
	mkdirSync(testTaskiDir, { recursive: true })
	mkdirSync(join(testTaskiDir, "stories"), { recursive: true })
})

afterAll(() => {
	if (existsSync(testTaskiDir)) {
		rmSync(testTaskiDir, { recursive: true, force: true })
	}
})

test("configGet returns correct paths from taski.json", async () => {
	const config = await configGet()
	expect(config.tasksFile).toBe("/home/david/Coding/personal-taski-cli/.taski/tasks.json")
	expect(config.storiesFolder).toBe("/home/david/Coding/personal-taski-cli/.taski/stories")
})

test("configGet returns correct paths from nested taski.json", async () => {
	const nestedDir = "/home/david/Coding/personal-taski-cli/test/nested"
	const nestedTaskiDir = join(nestedDir, ".taski")
	mkdirSync(nestedTaskiDir, { recursive: true })
	writeFileSync(join(nestedTaskiDir, "taski.json"), '{"tasksFile":"./my_tasks.json","storiesFolder":"./my_stories"}')
	writeFileSync(join(nestedTaskiDir, "my_tasks.json"), "[]")
	mkdirSync(join(nestedTaskiDir, "my_stories"), { recursive: true })

	const originalCwd = process.cwd()
	process.chdir(nestedDir)

	try {
		const config = await configGet()
		expect(config.tasksFile).toBe(join(nestedTaskiDir, "my_tasks.json"))
		expect(config.storiesFolder).toBe(join(nestedTaskiDir, "my_stories"))
	} finally {
		process.chdir(originalCwd)
		rmSync(nestedDir, { recursive: true, force: true })
	}
})

test("configGet throws error when taski.json is missing in isolated directory", async () => {
	const tempDir = "/tmp/taski_test_isolated_" + Date.now()
	mkdirSync(tempDir, { recursive: true })

	const originalCwd = process.cwd()
	process.chdir(tempDir)

	try {
		expect(configGet()).rejects.toThrow()
	} finally {
		process.chdir(originalCwd)
		rmSync(tempDir, { recursive: true, force: true })
	}
})

test("configGet validates taski.json against schema and throws", async () => {
	const tempDir = "/tmp/taski_test_invalid_" + Date.now()
	const tempTaskiDir = join(tempDir, ".taski")
	mkdirSync(tempTaskiDir, { recursive: true })
	writeFileSync(join(tempTaskiDir, "taski.json"), '{"tasksFile":123,"storiesFolder":"./stories"}')

	const originalCwd = process.cwd()
	process.chdir(tempDir)

	try {
		expect(configGet()).rejects.toThrow()
	} finally {
		process.chdir(originalCwd)
		rmSync(tempDir, { recursive: true, force: true })
	}
})
