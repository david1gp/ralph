export class ConfigNotFoundError extends Error {
	tried: string[]
	stoppedAt: string
	constructor(tried: string[], stoppedAt: string)
	constructor(_tried: string[], _path: string, _isOverride?: boolean)
	constructor(triedOrPath: string[] | string, stoppedAtOrPath: string, isOverride?: boolean) {
		if (Array.isArray(triedOrPath)) {
			super(JSON.stringify({
				error: ".taski directory not found",
				tried: triedOrPath,
				stoppedAt: stoppedAtOrPath,
			}))
			this.tried = triedOrPath
			this.stoppedAt = stoppedAtOrPath
		} else {
			super(JSON.stringify({
				error: ".taski directory not found",
				attempted: stoppedAtOrPath,
			}))
			this.tried = []
			this.stoppedAt = stoppedAtOrPath
		}
	}
}

export class ConfigValidationError extends Error {
	path: string
	constructor(message: string)
	constructor(path: string, _message?: string)
	constructor(pathOrMessage: string, message?: string) {
		if (message !== undefined) {
			super(JSON.stringify({
				error: "Invalid taski.json configuration",
				path: pathOrMessage,
				message,
			}))
			this.path = pathOrMessage
		} else {
			super(JSON.stringify({
				error: "Invalid taski.json configuration",
				message: pathOrMessage,
			}))
			this.path = pathOrMessage
		}
	}
}
