import { configGet } from "@/cli/core/configGet"
import { setConfigPath, getConfigPath, clearConfigPath } from "@/cli/core/configStore"
import { expect, test, beforeAll, afterAll, beforeEach } from "bun:test"
import { writeFileSync, rmSync, existsSync, mkdirSync } from "node:fs"
import { join } from "node:path"

const testTaskiDir = "/home/david/Coding/personal-taski-cli/.taski_test"
const testConfigPath = join(testTaskiDir, "taski.json")
const originalConfigPath = "/home/david/Coding/personal-taski-cli/.taski/taski.json"

const originalContent: string = "{\"tasksFile\":\"./tasks.json\",\"storiesFolder\":\"./stories\"}"

beforeAll(() => {
	clearConfigPath()
	if (!existsSync(testTaskiDir)) {
		mkdirSync(testTaskiDir, { recursive: true })
		mkdirSync(join(testTaskiDir, "stories"), { recursive: true })
		writeFileSync(testConfigPath, '{"tasksFile":"./tasks.json","storiesFolder":"./stories"}')
	}
})

afterAll(() => {
	clearConfigPath()
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

test("setConfigPath overrides config location with valid directory", async () => {
	setConfigPath(testTaskiDir)
	expect(getConfigPath()).toBe(testTaskiDir)

	const config = await configGet()
	expect(config.tasksFile).toBe(join(testTaskiDir, "tasks.json"))
	expect(config.storiesFolder).toBe(join(testTaskiDir, "stories"))
})

test("setConfigPath with non-existent directory throws error with attempted path", async () => {
	const nonExistentPath = "/tmp/non_existent_taski_dir_" + Date.now()
	setConfigPath(nonExistentPath)

	try {
		expect(configGet()).rejects.toThrow()
	} catch (error) {
		expect(error instanceof Error).toBe(true)
		const errorMessage = (error as Error).message
		const parsed = JSON.parse(errorMessage)
		expect(parsed.error).toBe(".taski directory not found")
		expect(parsed.attempted).toBe(join(nonExistentPath, "taski.json"))
	} finally {
		clearConfigPath()
	}
})

test("setConfigPath with invalid taski.json shows validation error with path", async () => {
	const tempDir = "/tmp/taski_test_invalid_override_" + Date.now()
	const tempTaskiDir = join(tempDir, ".taski")
	mkdirSync(tempTaskiDir, { recursive: true })
	writeFileSync(join(tempTaskiDir, "taski.json"), '{"tasksFile":123,"storiesFolder":"./stories"}')

	setConfigPath(tempTaskiDir)

	try {
		expect(configGet()).rejects.toThrow()
	} catch (error) {
		expect(error instanceof Error).toBe(true)
		const errorMessage = (error as Error).message
		const parsed = JSON.parse(errorMessage)
		expect(parsed.error).toBe("Invalid taski.json configuration")
		expect(parsed.path).toBe(join(tempTaskiDir, "taski.json"))
	} finally {
		clearConfigPath()
		rmSync(tempDir, { recursive: true, force: true })
	}
})

test("clearConfigPath resets the override", async () => {
	setConfigPath(testTaskiDir)
	expect(getConfigPath()).toBe(testTaskiDir)

	clearConfigPath()
	expect(getConfigPath()).toBeNull()
})

test("configGet works with relative path override", async () => {
	const relativePath = ".taski_test"
	setConfigPath(relativePath)

	try {
		const config = await configGet()
		expect(config.tasksFile).toBe(join(relativePath, "tasks.json"))
		expect(config.storiesFolder).toBe(join(relativePath, "stories"))
	} finally {
		clearConfigPath()
	}
})
