let configPath: string | null = null

export function setConfigPath(path: string): void {
	configPath = path
}

export function getConfigPath(): string | null {
	return configPath
}

export function clearConfigPath(): void {
	configPath = null
}
