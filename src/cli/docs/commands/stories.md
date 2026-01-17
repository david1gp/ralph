# Stories Commands

The `taski stories` command group provides commands for managing stories.

## Commands

### list

List all stories in the stories folder.

```bash
taski stories list
```

**Output:** JSON array of story filenames

**Example:**
```bash
$ taski stories list
[
  "taski_cli.md",
  "my_story.md"
]
```

---

### read

Read a story by filename.

```bash
taski stories read <filename>
```

**Arguments:**
- `filename` - Story filename (required, must include extension)

**Example:**
```bash
$ taski stories read taski_cli.md
{
  "title": "Taski CLI",
  "introduction": "A CLI for managing tasks and stories.",
  "goals": ["Goal 1", "Goal 2"],
  "userTasks": [...]
}
```

**Output:** JSON object with parsed story content including:
- `title` - Story title
- `introduction` - Introduction text
- `goals` - Array of goals
- `userTasks` - Array of user tasks

**Error:** Throws an error if the story file doesn't exist

---

### create

Create a new story file.

```bash
taski stories create <filename> <content>
```

**Arguments:**
- `filename` - Story filename (required, should include .md extension)
- `content` - Story content in markdown format (required)

**Example:**
```bash
$ taski stories create my_story.md "# My Story\n\n## Introduction\n\nThis is my story."
Story "my_story.md" created successfully
```

**Notes:**
- The content should be markdown format
- Use `\n` for line breaks in the content argument
- The file is created in the stories folder configured in TASKI_STORIES_FOLDER

---

### delete

Delete a story file.

```bash
taski stories delete <filename>
```

**Arguments:**
- `filename` - Story filename (required)

**Example:**
```bash
$ taski stories delete my_story.md
Story "my_story.md" deleted successfully
```

**Error:** `Story "filename" not found` if the file doesn't exist

**Warning:** This action cannot be undone. The file is permanently deleted.

## Story Format

Stories are markdown files with a specific structure:

```markdown
# Title

## Introduction

Introduction text here.

## Goals

- Goal 1
- Goal 2

## User Tasks

### Task 1

Description of task 1...

### Task 2

Description of task 2...
```

### Structure Details

| Section | Description |
|---------|-------------|
| `# Title` | The story title (first H1 heading) |
| `## Introduction` | Brief introduction to the story |
| `## Goals` | List of goals (bulleted) |
| `## User Tasks` | Section containing user tasks |

### Parsed Output

When reading a story, the CLI parses it into:

```json
{
  "title": "Story Title",
  "introduction": "Introduction text...",
  "goals": ["Goal 1", "Goal 2"],
  "userTasks": [
    {
      "id": "UT-001",
      "title": "Task Title",
      "description": "Task description..."
    }
  ]
}
```

## Common Workflows

### Creating a New Story

```bash
# Create a story with content
taski stories create new_feature.md "# New Feature\n\n## Introduction\n\nAdding X feature.\n\n## Goals\n\n- Implement feature\n- Write tests"
```

### Managing Multiple Stories

```bash
# List all stories
taski stories list

# Read a specific story
taski stories read taski_cli.md

# Delete an old story
taski stories delete old_story.md
```

### Using Stories for Project Documentation

Stories can serve as living documentation for your project:

```bash
# Read current story
taski stories read taski_cli.md > story_backup.json

# Create/update story with new content
taski stories create update.md "$(cat new_story_content.md)"
```

## Examples

### Full Example: Creating a Story

```bash
$ taski stories create example.md "# Example Story\n\n## Introduction\n\nThis is an example.\n\n## Goals\n\n- Learn CLI\n- Write docs"
Story "example.md" created successfully

$ taski stories list
[
  "taski_cli.md",
  "example.md"
]

$ taski stories read example.md
{
  "title": "Example Story",
  "introduction": "This is an example.",
  "goals": ["Learn CLI", "Write docs"],
  "userTasks": []
}
```

### Full Example: Deleting a Story

```bash
$ taski stories delete example.md
Story "example.md" deleted successfully

$ taski stories list
[
  "taski_cli.md"
]
```

## Configuration

Stories are stored in the folder specified by the `TASKI_STORIES_FOLDER` environment variable (default: `stories/`).

To change the stories folder, create a `.env` file:

```env
TASKI_STORIES_FOLDER=docs/stories
```
