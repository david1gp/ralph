import { existsSync, realpathSync } from "node:fs"
import { arch, platform, release } from "node:os"
import { dirname, isAbsolute, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import pkg from "../package.json" with { type: "json" }

function executableResolve(): { entrypoint: string; target?: string } {
  const entrypoint = process.argv[1]
  if (entrypoint === undefined) return { entrypoint: "unavailable" }

  const resolvedEntrypoint = resolve(entrypoint)
  try {
    return { entrypoint: resolvedEntrypoint, target: realpathSync(resolvedEntrypoint) }
  } catch {
    return { entrypoint: resolvedEntrypoint }
  }
}

function installationTypeResolve(executableTarget: string | undefined): string {
  const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
  if (existsSync(resolve(packageRoot, ".git"))) return "development checkout"
  if (executableTarget !== undefined) {
    const targetRelativeToPackage = relative(packageRoot, executableTarget)
    if (
      targetRelativeToPackage === "" ||
      (!targetRelativeToPackage.startsWith("..") && !isAbsolute(targetRelativeToPackage))
    ) {
      return "package installation"
    }
  }
  return "unknown"
}

function authorResolve(): string {
  const author = Reflect.get(pkg, "author")
  if (typeof author === "string") return author
  if (typeof author !== "object" || author === null) return "unavailable"

  const name = Reflect.get(author, "name")
  const url = Reflect.get(author, "url")
  return (
    [typeof name === "string" ? name : undefined, typeof url === "string" ? url : undefined]
      .filter(Boolean)
      .join(" — ") || "unavailable"
  )
}

export function cliVersionOutputRender(cliName: string, verbose: boolean): string {
  if (!verbose) return `${pkg.version}\n`

  const executable = executableResolve()
  const requirements = Object.entries(pkg.engines ?? {})
    .map(([runtime, requirement]) => `${runtime} ${requirement}`)
    .join(", ")
  const runtime = typeof Bun === "undefined" ? `${process.release.name} ${process.version}` : `bun ${Bun.version}`
  const project = pkg.homepage ?? pkg.repository.url

  return `${[
    `${cliName} v${pkg.version}`,
    `user agent: ${pkg.name}/${pkg.version}`,
    `executable: ${executable.entrypoint}`,
    `executable target: ${executable.target ?? "unavailable"}`,
    `version: ${pkg.version}`,
    `description: ${pkg.description ?? "unavailable"}`,
    `author: ${authorResolve()}`,
    `license: ${pkg.license ?? "unavailable"}`,
    `project: ${project ?? "unavailable"}`,
    `installation type: ${installationTypeResolve(executable.target)}`,
    `runtime: ${runtime}`,
    `runtime requirements: ${requirements || "unavailable"}`,
    `platform: ${platform} ${arch} (OS release ${release()})`,
  ].join("\n")}\n`
}
