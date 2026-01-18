import { storyCreateFunc } from "@/cli/cmd/stories/storyCreateCommand"
import { storiesList } from "@/cli/core/stories/storiesList"
import { storyRead } from "@/cli/core/stories/storyRead"
import { afterAll, beforeAll, beforeEach, expect, mock, test } from "bun:test"
import { existsSync, readFileSync, rmSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import type { Result } from "~utils/result/Result"
import { assertOk, getTestConfig, resetTasksFile, testAfterAll, testBeforeAll } from "../testHelpers"

const __dirname = dirname(fileURLToPath(import.meta.url))
const testDir = join(__dirname, "..")

const testStoryContent = `# Story: Test Story

## Description

This is a test story for unit testing purposes.

## Goals

- Test listStories function
- Test readStory function
- Test createStory function
- Test deleteStory function

## User Tasks

### T-TEST1: First test task
### T-TEST2: Second test task
### T-TEST3: Third test task
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
  const files = ["S-001_test-001_test-story.md", "S-001_test-002_another-test.md", "S-001_test-003_escape-test.md"]
  for (const file of files) {
    const testFile = testStoriesPath + "/" + file
    if (existsSync(testFile)) {
      rmSync(testFile)
    }
  }
})

test("storyCreateFunc creates story with escape sequences transformed", async () => {
  const originalCwd = process.cwd()
  process.chdir(testDir)
  try {
    const context = createMockContext()
    const params = {
      shortStoryTitle: "escape-test",
      projectDir: testDir,
      content:
        "# Story: Escape Test\\n\\n## Description\\n\\nLine one\\nLine two\\n\\n## Goals\\n\\n- Goal one\\n- Goal two\\n\\n## User Tasks\\n\\n### T-ESC-001: Task\\twith\\ttabs",
      config: undefined,
    }
    await storyCreateFunc.call(context, params)

    expect(stdout[0]).toMatch(/S-\d{3}_core-\d{3}_escape-test\.md/)
    const filename = stdout[0]!.split("/").pop() ?? ""
    const storyFilePath = join(testStoriesPath, filename)
    const fileContent = readFileSync(storyFilePath, "utf-8")
    expect(fileContent).toContain("# Story: Escape Test")
    expect(fileContent).toContain("## Description")
    expect(fileContent).toContain("Line one\nLine two")
    expect(fileContent).toContain("  with  tab")
    expect(fileContent).not.toContain("\\n")
    expect(fileContent).not.toContain("\\t")
  } finally {
    process.chdir(originalCwd)
  }
})
