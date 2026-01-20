import { taskIdGenerate } from "@/taski/tasks/logic/taskIdGenerate"
import { getTestConfig, projectRoot } from "@/taski/utils/test/testHelpers"
import { expect, test } from "bun:test"

test("taskIdGenerate uses TEST prefix from projectTaskPrefix config", () => {
  const config = getTestConfig()
  const result = taskIdGenerate(config, projectRoot)
  expect(result.prefix).toBe("TEST")
  expect(result.id.startsWith("TEST-")).toBe(true)
  expect(result.id).toBe("TEST-001")
})
