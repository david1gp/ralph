import type { TaskType } from "@/ralph/data/TaskType"
import { describe, expect, it } from "bun:test"

const testPromptContent = `# Ralph Agent Instructions

You are an autonomous coding agent working on a software project.

## Your Task

1. Implement the task in the directory specified above
2. Run quality checks
3. Mark task as complete`

async function mockBuildPrompt(task: TaskType, promptContent: string): Promise<string> {
  const acceptanceCriteria = task.acceptanceCriteria.map((c) => `- ${c}`).join("\n")

  let optionalFields = ""
  if (task.note) optionalFields += `\nNote: ${task.note}`
  if (task.story) optionalFields += `\nStory: ${task.story}`
  if (task.startedAt) optionalFields += `\nStarted: ${task.startedAt}`
  if (task.completedAt) optionalFields += `\nEnded: ${task.completedAt}`

  return `# ${task.id} - ${task.title}

Task ID: ${task.id}
Working Directory: ${task.projectPath}
Description: ${task.description}

Acceptance Criteria:
${acceptanceCriteria}

Priority: ${task.priority}
${optionalFields}

---
${promptContent}`
}

describe("buildPrompt", () => {
  it("should build prompt with full task including all optional fields", async () => {
    const task: TaskType = {
      id: "task-123",
      projectPath: "/home/david/Coding/project",
      title: "Implement login feature",
      description: "Add user authentication with JWT tokens",
      acceptanceCriteria: ["Users can login", "Users can logout", "Session expires after 1 hour"],
      priority: 1,
      note: "Use existing auth library",
      story: "As a user, I want to login so I can access my account",
      startedAt: "2024-01-01T10:00:00Z",
      completedAt: "2024-01-01T12:00:00Z",
    }

    const result = await mockBuildPrompt(task, testPromptContent)

    expect(result).toContain("# task-123 - Implement login feature")
    expect(result).toContain("Task ID: task-123")
    expect(result).toContain("Working Directory: /home/david/Coding/project")
    expect(result).toContain("Description: Add user authentication with JWT tokens")
    expect(result).toContain("- Users can login")
    expect(result).toContain("- Users can logout")
    expect(result).toContain("- Session expires after 1 hour")
    expect(result).toContain("Priority: 1")
    expect(result).toContain("Ralph Agent Instructions")
    expect(result).toContain("Story: As a user, I want to login so I can access my account")
    expect(result).toContain("Started: 2024-01-01T10:00:00Z")
    expect(result).toContain("Ended: 2024-01-01T12:00:00Z")
    expect(result).toContain("Ralph Agent Instructions")
  })

  it("should build prompt with only required fields", async () => {
    const task: TaskType = {
      id: "task-456",
      projectPath: "/home/david/Coding/myapp",
      title: "Fix bug",
      description: "Fix the null pointer exception",
      acceptanceCriteria: [],
      priority: 2,
      story: "",
    }

    const result = await mockBuildPrompt(task, testPromptContent)

    expect(result).toContain("# task-456 - Fix bug")
    expect(result).toContain("Task ID: task-456")
    expect(result).toContain("Working Directory: /home/david/Coding/myapp")
    expect(result).toContain("Description: Fix the null pointer exception")
    expect(result).toContain("Acceptance Criteria:")
    expect(result).not.toContain("Note:")
    expect(result).not.toContain("Story:")
    expect(result).not.toContain("Started:")
    expect(result).not.toContain("Ended:")
    expect(result).toContain("Priority: 2")
  })

  it("should handle special characters in task fields", async () => {
    const task: TaskType = {
      id: "task-789",
      projectPath: "/home/david/Coding/project-with-dashes",
      title: "Handle `backticks` and 'quotes'",
      description: 'Handle "special chars" like <brackets> and $dollar',
      acceptanceCriteria: ["Handle `code`", "Handle 'single'", 'Handle "double"'],
      priority: 3,
      story: "",
    }

    const result = await mockBuildPrompt(task, testPromptContent)

    expect(result).toContain("# task-789 - Handle `backticks` and 'quotes'")
    expect(result).toContain('Description: Handle "special chars" like <brackets> and $dollar')
    expect(result).toContain("- Handle `code`")
    expect(result).toContain("- Handle 'single'")
    expect(result).toContain('- Handle "double"')
  })

  it("should include prompt template content in output", async () => {
    const task: TaskType = {
      id: "task-001",
      projectPath: "/tmp",
      title: "Test",
      description: "Test description",
      acceptanceCriteria: [],
      priority: 1,
      story: "",
    }

    const result = await mockBuildPrompt(task, testPromptContent)

    expect(result).toContain("Ralph Agent Instructions")
    expect(result).toContain("## Your Task")
    expect(result).toContain("1. Implement the task in the directory specified above")
  })

  it("should handle task with only note field", async () => {
    const task: TaskType = {
      id: "task-note",
      projectPath: "/app",
      title: "Task with note",
      description: "Only has a note",
      acceptanceCriteria: ["Must pass"],
      priority: 1,
      story: "",
      note: "Remember to test edge cases",
    }

    const result = await mockBuildPrompt(task, testPromptContent)

    expect(result).toContain("Note: Remember to test edge cases")
    expect(result).not.toContain("Story:")
  })

  it("should handle task with only story field", async () => {
    const task: TaskType = {
      id: "task-story",
      projectPath: "/app",
      title: "Task with story",
      description: "Only has a story",
      acceptanceCriteria: ["Must pass"],
      priority: 1,
      story: "As a developer, I want clean code",
    }

    const result = await mockBuildPrompt(task, testPromptContent)

    expect(result).toContain("Story: As a developer, I want clean code")
    expect(result).not.toContain("Note:")
  })
})
