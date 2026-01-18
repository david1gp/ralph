import { taskIdGenerate } from "@/cli/core/tasks/taskIdGenerate"
import { expect, test } from "bun:test"
import { getTestConfig } from "../testHelpers"

test("taskIdGenerate uses TEST prefix from projectTaskPrefix config", () => {
  const config = getTestConfig()
  const testDir = "test-dir"
  const result = taskIdGenerate(config, testDir)
  expect(result.prefix).toBe("TEST")
  expect(result.id.startsWith("TEST-")).toBe(true)
  expect(result.id).toBe("TEST-001")
})
