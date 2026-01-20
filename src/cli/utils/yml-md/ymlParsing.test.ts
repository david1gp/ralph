import { expect, test } from "bun:test"
import { parseMarkdownWithFrontmatter } from "./ymlParsing"
import { join } from "path"

test("parse markdown with frontmatter", async () => {
  const testDir = import.meta.dirname
  const markdown = await Bun.file(join(testDir, "./ymlFile.md")).text()

  const { data, content } = parseMarkdownWithFrontmatter(markdown)

  console.log("Metadata:", data)
  console.log("Content:\n", content)
  expect(data.title).toEqual("Test")
  expect(content).toInclude("This is test content for frontmatter parsing.")
})
