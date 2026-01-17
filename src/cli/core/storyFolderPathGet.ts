import { existsSync, readFileSync } from "node:fs"

export function storyFolderPathGet(): string {
	validateEnvFile()
	const envPath = getEnvFilePath()
	const content = readFileSync(envPath, "utf-8")
	const result = content.match(/TASKI_STORIES_FOLDER=(.+)/)
	if (!result || !result[1]) {
		throw new Error("TASKI_STORIES_FOLDER not found in .env file")
	}
	return result[1].trim()
}

function getEnvFilePath(): string {
	return ".env"
}

function validateEnvFile(): void {
	const envPath = getEnvFilePath()
	if (!existsSync(envPath)) {
		throw new Error(".env file not found at " + envPath)
	}
}
