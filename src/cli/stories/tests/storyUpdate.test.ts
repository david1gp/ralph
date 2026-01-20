import { storyRead } from "@/cli/stories/logic/storyRead"
import { storyUpdate } from "@/cli/stories/logic/storyUpdate"
import { assertErr, assertOk, getTestConfig, testAfterAll, testBeforeAll } from "@/cli/utils/test/testHelpers"
import { afterAll, beforeAll, expect, test } from "bun:test"
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs"

const testConfig = getTestConfig()
const testStoriesPath = testConfig.storiesFolder
const testStoryFilename = "storyUpdate.md"

const initialContent = `# Story: Initial Title

## Description

Initial description

## Goals

- Initial goal

## User Tasks

### TASK-001: Initial task
`

beforeAll(testBeforeAll)
afterAll(testAfterAll)

test("storyUpdate replaces file content", async () => {
  const testFile = `${testStoriesPath}/${testStoryFilename}`
  if (existsSync(testFile)) {
    rmSync(testFile)
  }
  writeFileSync(testFile, initialContent)

  const newContent = `# Story: Updated Title

## Description

New description

## Goals

- New goal one
- New goal two

## User Tasks

### TASK-101: New task one
### TASK-102: New task two
`

  const result = await storyUpdate(testConfig, testStoryFilename, newContent)
  expect(result.success).toBe(true)
  assertOk(result)

  const readResult = await storyRead(testConfig, testStoryFilename)
  expect(readResult.success).toBe(true)
  assertOk(readResult)
  expect(readResult.data).toBe(newContent)
})

test("storyUpdate returns error for non-existent story", async () => {
  const result = await storyUpdate(testConfig, "non_existent_story.md", "# Story: Test")
  expect(result.success).toBe(false)
  assertErr(result)
  expect(result.errorMessage).toContain("non_existent_story.md")
})
