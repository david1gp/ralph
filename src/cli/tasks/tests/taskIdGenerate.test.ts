import { taskIdGenerate } from "@/cli/tasks/logic/taskIdGenerate"
import { expect, test } from "bun:test"
import { getTestConfig, projectRoot } from "../../utils/test/testHelpers"

test("taskIdGenerate uses TEST prefix from projectTaskPrefix config", () => {
  const config = getTestConfig()
  const result = taskIdGenerate(config, projectRoot)
  expect(result.prefix).toBe("TEST")
  expect(result.id.startsWith("TEST-")).toBe(true)
  expect(result.id).toBe("TEST-001")
})
