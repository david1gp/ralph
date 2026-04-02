import type { TaskType } from "@/taski/tasks/data/TaskType"

export async function buildPrompt(task: TaskType): Promise<string> {
  // const storyContent = await Bun.file(task.story).text()
  const acceptanceCriteria = task.acceptanceCriteria.map((c) => `- ${c}`).join("\n")
  return `# ${task.id} - ${task.title}

## Information

Implement the following task

Task ID:
${task.id}

Working Directory:
${task.projectPath}

Description:
${task.description}

Acceptance Criteria:
${acceptanceCriteria}

User Story:
${task.story}

## Implementation Steps

1. Explore User Story for context and earlier progress
2. Implement the task
3. Check that all acceptance criteria pass
4. Append progress report to \`${task.story}\`
5. Mark task as complete then finished

## Quality Requirements

- ALL changes must pass your project's quality checks (bun run tsgo, bun test)
- Follow existing code patterns
- Keep changes focused and minimal

## Acceptance criteria

- ALL changes must pass your project's quality checks (bun run tsgo, bun test)

---

## Report progress then finished

Be concise. Be punchy. Keep commentary under 30 lines.

APPEND to \`${task.story}\` (never replace, always append):

\`\`\`
## [Date/Time] - [Task ID]
- What was implemented
- Learnings for future iterations
  - Patterns discovered (e.g., "this codebase uses X for Y")
  - Gotchas encountered (e.g., "don't forget to update Z when changing W")
  - Useful context (e.g., "the evaluation panel is in component X")
---
\`\`\`

## Mark task as complete then finished

\`\`\`bash
taski tasks update \
  ${task.id} \
--completedAt now
\`\`\`
`
}
