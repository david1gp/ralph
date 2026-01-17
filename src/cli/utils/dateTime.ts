import { safeParse } from "valibot"
import { dateTimeSchema } from "~utils/valibot/dateTimeSchema"

export function parseDateTime(value: string): string | undefined {
	if (value === "now") {
		return new Date().toISOString()
	}
	if (value === "") {
		return undefined
	}
	const result = safeParse(dateTimeSchema, value)
	if (!result.success) {
		throw new Error(`Invalid date-time format: "${value}". Use ISO 8601 format or "now".`)
	}
	return result.output
}
