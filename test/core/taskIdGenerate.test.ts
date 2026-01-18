import { taskIdGenerate } from "@/cli/core/taskIdGenerate"
import { getTestConfig } from "../testHelpers"
import { expect, test } from "bun:test"

test("taskIdGenerate uses TEST prefix from projectTaskPrefix config", () => {
	const config = getTestConfig()
	const testDir = "/home/david/Coding/personal-taski-cli"
	const result = taskIdGenerate(config, testDir)
	expect(result.prefix).toBe("TEST")
	expect(result.id.startsWith("TEST-")).toBe(true)
	expect(result.id).toBe("TEST-001")
})
