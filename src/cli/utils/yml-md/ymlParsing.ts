export function parseMarkdownWithFrontmatter(md: string) {
  // Match YAML frontmatter at the very beginning
  const fmRegex = /^---\s*\n([\s\S]*?)\n---\s*\n?/

  const match = md.match(fmRegex)

  if (!match) {
    // No frontmatter → treat whole file as content
    return {
      data: {},
      content: md,
    }
  }

  const rawYaml = match[1]
  if (rawYaml === undefined) {
    return { data: {}, content: md.trimStart() }
  }
  const content = md.slice(match[0].length).trimStart()

  let data: Record<string, unknown>

  try {
    const parsed = Bun.YAML.parse(rawYaml)
    if (typeof parsed === "object" && parsed !== null) {
      data = parsed as Record<string, unknown>
    } else {
      data = {}
    }
  } catch (err) {
    console.error("YAML parsing failed:", err)
    data = {} // or throw — your choice
  }

  return {
    data, // your frontmatter object
    content, // markdown body
  }
}
