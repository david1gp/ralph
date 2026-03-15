import { safeParse } from "valibot"
import { dateTimeSchema } from "~utils/valibot/dateTimeSchema"
import { createResult, createError, type Result } from "~result"

export function parseDateTime(value: string): Result<string> | undefined {
  if (value === "now") {
    return createResult(new Date().toISOString())
  }
  if (value === "") {
    return undefined
  }
  const result = safeParse(dateTimeSchema, value)
  if (!result.success) {
    return createError("parseDateTime", `Invalid date-time format: "${value}". Use ISO 8601 format or "now".`)
  }
  return createResult(result.output)
}
