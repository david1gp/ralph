export class ConfigNotFoundError extends Error {
	tried: string[]
	stoppedAt: string
	constructor(tried: string[], stoppedAt: string) {
		super(JSON.stringify({
			error: ".taski directory not found",
			tried,
			stoppedAt,
		}))
		this.tried = tried
		this.stoppedAt = stoppedAt
	}
}

export class ConfigValidationError extends Error {
	constructor(message: string) {
		super(JSON.stringify({
			error: "Invalid taski.json configuration",
			message,
		}))
	}
}
