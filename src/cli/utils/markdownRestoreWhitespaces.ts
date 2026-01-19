export function markdownRestoreWhitespaces(content: string): string {
  return content.replace(/\\n/g, "\n").replace(/\\t/g, "  ")
}
