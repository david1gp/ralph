import { describe, expect, test } from "bun:test"
import { cliVersionOutputRender } from "@/cliVersionOutputRender"
import { packageVersion } from "@/packageVersion"

describe("cliVersionOutputRender", () => {
  test("preserves plain version output", () => {
    expect(cliVersionOutputRender("ralph", false)).toBe(`${packageVersion}\n`)
  })

  test("renders package and runtime metadata without build details", () => {
    const output = cliVersionOutputRender("taski", true)

    expect(output).toContain(`taski v${packageVersion}`)
    expect(output).toContain(`user agent: @adaptive-ds/ralph/${packageVersion}`)
    expect(output).toContain("executable:")
    expect(output).toContain("executable target:")
    expect(output).toContain("description: Your personal task manager, built for AI agents.")
    expect(output).toContain("license: MIT")
    expect(output).toContain("project: https://github.com/david1gp/ralph")
    expect(output).toContain("installation type:")
    expect(output).toContain("runtime: bun ")
    expect(output).toContain("runtime requirements: bun >=1.1")
    expect(output).toContain("platform:")
    expect(output).not.toContain("build:")
  })
})
