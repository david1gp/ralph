# @adaptive-sm/taski

**Your personal task manager, built for AI agents.**

Keep your work organized in simple files that both you and your AI assistants can navigate effortlessly.

Why taski?

- **100% local** — Everything lives in your filesystem. No cloud, no accounts, no lock-in.
- **AI-friendly** — Stories and tasks are plain files (Markdown + JSON) that any agent can read, parse, and update.
- **Ralph-ready** — The `next` command returns a single pending task. Perfect for ralph agent loops that need one next task at a time.
- **Flexible** — Configure custom paths for stories, tasks, and archives. Works with any project structure.

Quick Links

- code - https://github.com/adaptive-shield-matrix/taski
- ralph - https://github.com/adaptive-shield-matrix/ralph
- opencode - https://opencode.ai

## Project structure

```
.taski/
├── taski.json          # Configuration
├── tasks.json          # Active tasks (JSON)
├── tasks-archive/      # Archived tasks by year-month
└── stories/            # User stories (Markdown)
```

Default locations are `.taski/` in your project directory, but everything is configurable.

## Quick start

```sh
# Install and link
bun install
bun link

# Initialize in your project
taski init

# Create your first story
taski stories create --title "User authentication" --description "As a user..." --goals "login works" "logout works"

# Add a task linked to that story
taski tasks create --story "User authentication" --title "Add login form" --description "Create the UI components" --priority 1

# See what needs doing next
taski tasks next
```

## Commands

### Initialize a project

```sh
taski init                      # Initialize in current directory
taski init --dir /path/to/proj  # Initialize elsewhere
```

### Stories

```sh
taski stories create --title "Story title" --description "Full description..." --goals "goal one" "goal two"
taski stories list
taski stories read "Story title"
taski stories update "Story title" --description "Updated description..."
taski stories delete "Story title"
```

### Tasks

```sh
taski tasks create --story "Story title" --title "Task title" --description "What to do" --priority 1
taski tasks list
taski tasks read TAC-1
taski tasks update TAC-1 --completed-at now
taski tasks next
taski tasks delete TAC-1
```

**Priority** is a number — higher values appear first in `next`.

## Story Filenames

Stories are saved as individual Markdown files in `.taski/stories/`.

**Filename format:**
```
S-{globalId}_{abbr}-{projectId}_{title-slugified}.md
```

- `globalId` — Global story counter (001, 002, ...)
- `abbr` — Project prefix from config or directory name
- `projectId` — Per-project story counter (001, 002, ...)
- `title-slugified` — Title with spaces converted to dashes

**Examples:**
```
S-001_TAC-001_user-authentication.md
S-002_ABC-015_add-payment-flow.md
```

The global ID tracks stories across all projects. The project ID resets per project.

## Ralph agent loop

The `next` command is designed for agent loops:

```sh
# Get only the next pending task (excludes completed tasks)
TASK=$(taski tasks next --config /path/to/.taski)

# Agent works on TASK...

# Mark as complete
taski tasks update TAC-1 --completed-at now
```

Benefits:

- **Single-task fetch** — No need to load all tasks. `next` returns one or `null`.
- **Completion tracking** — Tasks are complete when `completedAt` is set, no ambiguous status strings.
- **Story linking** — Each task references its story, so agents can read context in one file read.
- **Append progress** — Agents update the story Markdown directly, building a complete narrative.

## Configuration

Edit `.taski/taski.json` to customize locations:

```json
{
  "tasksFile": "tasks.json",
  "tasksArchivedDir": "tasks-archive",
  "storiesFolder": "stories",
  "projectTaskPrefix": {
    "/path/to/project": "PFX"
  },
  "projectTaskIdNumber": {
    "/path/to/project": 1
  }
}
```

`projectTaskPrefix` generates IDs like `PFX-1`, `PFX-2` automatically.

## Inspirations / Prior Work

- ["Ship working code while you sleep with the Ralph Wiggum technique"](https://www.youtube.com/watch?v=_IK18goX4X8)
- ["Matt Pocock on ralph-driven development"](https://x.com/mattpocockuk/status/2006807098076881312)
- ["Stop Chatting with AI. Start Loops (Ralph Driven Development)"](https://lukeparker.dev/stop-chatting-with-ai-start-loops-ralph-driven-development)
- ["Evan Otero on ralph"](https://x.com/EvanOtero/status/2009341616721436773)
- ["Ralph Wiggum as a 'software engineer'"](https://ghuntley.com/ralph/)
- ["Ralph - autonomous AI agent loop"](https://github.com/snarktank/ralph)
- ["Ryan Carson on ralph"](https://x.com/ryancarson/status/2008548371712135632)
