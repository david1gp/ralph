import { safeParse } from "valibot"
import { createError, createResult, type Result } from "~result"
import { dateTimeSchema } from "~utils/valibot/dateTimeSchema"

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
