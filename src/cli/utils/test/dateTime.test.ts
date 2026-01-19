import { expect, test } from "bun:test"
import { parseDateTime } from "@/cli/utils/dateTime"
import type { Result } from "~utils/result/Result"

function assertOk<T>(result: Result<T>): asserts result is Extract<typeof result, { success: true }> {
  if (!result.success) {
    throw new Error(`Expected success but got error: ${result.errorMessage}`)
  }
}

function assertErr<T>(result: Result<T>): asserts result is Extract<typeof result, { success: false }> {
  if (result.success) {
    throw new Error(`Expected error but got success`)
  }
}

test("parseDateTime returns success for 'now'", () => {
  const result = parseDateTime("now")
  expect(result).toBeDefined()
  expect(result!.success).toBe(true)
  assertOk(result!)
  expect(result.data).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
})

test("parseDateTime returns undefined for empty string", () => {
  const result = parseDateTime("")
  expect(result).toBeUndefined()
})

test("parseDateTime parses valid ISO 8601 timestamp", () => {
  const result = parseDateTime("2025-01-17T10:30:00.000Z")
  expect(result).toBeDefined()
  expect(result!.success).toBe(true)
  assertOk(result!)
  expect(result.data).toBe("2025-01-17T10:30:00.000Z")
})

test("parseDateTime returns error for invalid format", () => {
  const result = parseDateTime("invalid-date")
  expect(result).toBeDefined()
  expect(result!.success).toBe(false)
  assertErr(result!)
  expect(result.errorMessage).toContain('Invalid date-time format: "invalid-date"')
})

test("parseDateTime returns error for wrong format", () => {
  const result = parseDateTime("2025/01/17")
  expect(result).toBeDefined()
  expect(result!.success).toBe(false)
  assertErr(result!)
  expect(result.errorMessage).toContain('Invalid date-time format: "2025/01/17"')
})
