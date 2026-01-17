import { expect, test } from "bun:test"
import { parseDateTime } from "@/cli/utils/dateTime"

test("parseDateTime returns ISO string for 'now'", () => {
	const result = parseDateTime("now")
	expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
})

test("parseDateTime returns undefined for empty string", () => {
	const result = parseDateTime("")
	expect(result).toBeUndefined()
})

test("parseDateTime parses valid ISO 8601 timestamp", () => {
	const result = parseDateTime("2025-01-17T10:30:00.000Z")
	expect(result).toBe("2025-01-17T10:30:00.000Z")
})

test("parseDateTime throws error for invalid format", () => {
	expect(() => parseDateTime("invalid-date")).toThrow(
		'Invalid date-time format: "invalid-date". Use ISO 8601 format or "now".',
	)
})

test("parseDateTime throws error for wrong format", () => {
	expect(() => parseDateTime("2025/01/17")).toThrow(
		'Invalid date-time format: "2025/01/17". Use ISO 8601 format or "now".',
	)
})
