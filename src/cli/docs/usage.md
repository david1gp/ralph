# Taski CLI Usage Guide

Taski is a command-line interface for managing tasks and stories. It provides a set of commands to list, read, create, update, and delete tasks and stories.

## Installation

Ensure you have Bun installed, then run:

```bash
bun install
```

## Quick Start

```bash
# List all tasks
taski tasks list

# Show the next pending task
taski tasks next

# Create a new task
taski tasks create "Implement new feature"

# Mark a task as complete
taski tasks update T-001 --passes true

# List all stories
taski stories list

# Read a specific story
taski stories read taski_cli.md
```

## Command Structure

Taski uses a hierarchical command structure:

```
taski <command-group> <subcommand> [arguments] [flags]
```

### Command Groups

- `tasks` - Manage tasks
- `stories` - Manage stories

### Global Commands

- `help` - Show help for a command (automatically shown when running with insufficient arguments)

## Examples

### Managing Tasks

```bash
# List all tasks as JSON
taski tasks list

# Read a specific task
taski tasks read T-001

# Create a new task
taski tasks create "Fix bug in auth"

# Update task status
taski tasks update T-001 --passes true

# Show next pending task
taski tasks next

# Delete a task
taski tasks delete T-010
```

### Managing Stories

```bash
# List all stories
taski stories list

# Read a story
taski stories read taski_cli.md

# Create a new story
taski stories create my_story.md "# My Story\n\nContent here"

# Delete a story
taski stories delete my_story.md
```

## Configuration

Taski uses environment variables for configuration:

- `TASKI_TASKS_FILE` - Path to the tasks.json file (default: tasks/tasks.json)
- `TASKI_STORIES_FOLDER` - Path to the stories folder (default: stories)

Create a `.env` file in the project root:

```env
TASKI_TASKS_FILE=tasks/tasks.json
TASKI_STORIES_FOLDER=stories
```

## Output Format

All commands output JSON by default, except for confirmation messages which are plain text.

### JSON Output

Commands like `list`, `read`, and `next` output formatted JSON:

```json
{
  "id": "T-001",
  "title": "Set up project structure",
  "passes": true,
  ...
}
```

### Success Messages

Commands that modify data output plain text confirmation:

```
Task "T-001" created successfully
Story "my_story.md" deleted successfully
```

## Error Handling

Invalid commands or missing arguments show helpful error messages:

```
Error: Task "T-999" not found
```

## Getting Help

Run any command with insufficient arguments to see help:

```bash
taski tasks
taski stories
taski tasks create
```

This displays available subcommands and their usage.
