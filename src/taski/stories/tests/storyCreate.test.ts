import { storyCreateFunc } from "@/taski/stories/cli/storyCreateCommand"
import {
    getTestConfig,
    projectRoot,
    resetTasksFile,
    testAfterAll,
    testBeforeAll,
    testTaskiDir,
} from "@/taski/utils/test/testHelpers"
import { afterAll, beforeAll, beforeEach, expect, mock, test } from "bun:test"
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const testStoryContent = `# Story: Test Story

## Description

This is a test story for unit testing purposes.

## Goals

- Test listStories function
`

const testConfig = getTestConfig()
const testStoriesPath = testConfig.storiesFolder

let stdout: string[] = []

const mockProcess = {
  stdout: {
    write: mock((text: string) => {
      stdout.push(text)
    }),
  },
}

function createMockContext() {
  return {
    process: mockProcess,
  } as any
}

beforeAll(() => {
  testBeforeAll()
  stdout = []
})

afterAll(() => {
  testAfterAll()
})

beforeEach(() => {
  stdout = []
  resetTasksFile()
  const oldFiles = ["S-001_test-001_test-story.md", "S-001_test-002_another-test.md", "S-001_test-003_escape-test.md"]
  for (const file of oldFiles) {
    const testFile = testStoriesPath + "/" + file
    if (existsSync(testFile)) {
      rmSync(testFile)
    }
  }
  const oldEscapeFiles = ["S-000_adaptive-ralph-001_escape-test.md"]
  for (const file of oldEscapeFiles) {
    const testFile = testStoriesPath + "/" + file
    if (existsSync(testFile)) {
      rmSync(testFile)
    }
  }
})

test("storyCreateFunc creates story with escape sequences transformed", async () => {
  const originalCwd = process.cwd()
  process.chdir(projectRoot)
  let createdFile: string | null = null
  try {
    const context = createMockContext()
    const params = {
      shortTitle: "escape-test",
      projectPath: projectRoot,
      content:
        "# Story: Escape Test\\n\\n## Description\\n\\nLine one\\nLine two\\n\\n## Goals\\n\\n- Goal one\\n- Goal two\\n\\n## User Tasks\\n\\n### T-ESC-001: Task\\twith\\ttabs",
      config: testTaskiDir,
    }
    await storyCreateFunc.call(context, params)

    expect(stdout[0]).toMatch(/S-\d{3}_adaptive-ralph-\d{3}_escape-test\.md/)
    const filename = stdout[0]!.split("/").pop() ?? ""
    createdFile = join(testStoriesPath, filename)
    const fileContent = readFileSync(createdFile, "utf-8")
    expect(fileContent).toContain("# Story: Escape Test")
    expect(fileContent).toContain("## Description")
    expect(fileContent).toContain("Line one\nLine two")
    expect(fileContent).toContain("  with  tab")
    expect(fileContent).not.toContain("\\n")
    expect(fileContent).not.toContain("\\t")
  } finally {
    process.chdir(originalCwd)
    if (createdFile && existsSync(createdFile)) {
      rmSync(createdFile)
    }
  }
})

test("storyCreateFunc creates story from file using --from-file", async () => {
  const originalCwd = process.cwd()
  process.chdir(projectRoot)
  let createdFile: string | null = null
  const tempSourceFile = join(projectRoot, "temp-test-story.md")
  try {
    writeFileSync(tempSourceFile, testStoryContent, "utf-8")

    const context = createMockContext()
    const params = {
      shortTitle: "from-file-test",
      projectPath: projectRoot,
      fromFile: tempSourceFile,
      config: testTaskiDir,
    }
    await storyCreateFunc.call(context, params)

    expect(stdout[0]).toMatch(/S-\d{3}_adaptive-ralph-\d{3}_from-file-test\.md/)
    const filename = stdout[0]!.split("/").pop() ?? ""
    createdFile = join(testStoriesPath, filename)
    const fileContent = readFileSync(createdFile, "utf-8")
    expect(fileContent).toContain("# Story: Test Story")
    expect(fileContent).toContain("## Description")
    expect(fileContent).toContain("This is a test story for unit testing purposes.")
    expect(fileContent).toContain("## Goals")
    expect(fileContent).toContain("- Test listStories function")
  } finally {
    process.chdir(originalCwd)
    if (createdFile && existsSync(createdFile)) {
      rmSync(createdFile)
    }
    if (existsSync(tempSourceFile)) {
      rmSync(tempSourceFile)
    }
  }
})

test("storyCreateFunc does not add .md extension if shortTitle already ends with .md", async () => {
  const originalCwd = process.cwd()
  process.chdir(projectRoot)
  let createdFile: string | null = null
  try {
    const context = createMockContext()
    const params = {
      shortTitle: "custom-title.md",
      projectPath: projectRoot,
      content: testStoryContent,
      config: testTaskiDir,
    }
    await storyCreateFunc.call(context, params)

    expect(stdout[0]).toMatch(/S-\d{3}_adaptive-ralph-\d{3}_custom-title\.md$/)
    const filename = stdout[0]!.split("/").pop() ?? ""
    expect(filename.endsWith("custom-title.md")).toBe(true)
    createdFile = join(testStoriesPath, filename)
    const fileContent = readFileSync(createdFile, "utf-8")
    expect(fileContent).toContain("# Story: Test Story")
  } finally {
    process.chdir(originalCwd)
    if (createdFile && existsSync(createdFile)) {
      rmSync(createdFile)
    }
  }
})
