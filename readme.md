# @adaptive-sm/ralph - An autonomous opencode agent

Ralph is an AI that never sleeps. 
It runs opencode on loop, grinding through tasks until everything's done. 
Fresh context every iteration. Relentless execution.

**Ralph + taski: The autonomous development engine.**

- **Ralph** — The agent loop that executes tasks relentlessly
- **taski** — The task engine that stores stories and tasks, feeding Ralph one task at a time

Together, they form a system that never stops until the work is done.

Quick Links

- code - https://github.com/adaptive-shield-matrix/ralph
- opencode - https://opencode.ai

---

## The System

### Ralph Agent Loop

Ralph is an autonomous agent that:

1. Fetches the next pending task via `taski tasks next`
2. Runs opencode with task instructions
3. Marks the task complete via `taski tasks update --completedAt now`
4. Repeats until all tasks pass or max iterations reached

Each iteration starts with a clean slate - no context rot, no memory leaks, no drift. 
Just fresh execution on the next piece of work.

### taski: Task Storage Engine

taski is the memory of the system. It stores:

- **Stories** — User stories as Markdown files in `.taski/stories/`
- **Tasks** — Pending work as JSON in `.taski/tasks.json`
- **Progress** — Completed timestamps and status updates

The `next` command returns a single task or `null`, perfect for agent loops. 
No filtering, no pagination, no complexity.

---

## Ralph Details

### Prerequisites

- [bun runtime](https://bun.com) installed
- [opencode CLI](https://opencode.ai) installed and authenticated

### Installation

```bash
bun install
bun link
```

### Running Ralph

```bash
bun run ralph              # Run with defaults (50 iterations)
bun run ralph --max 10     # Custom iteration limit
```

Ralph will run until:
- All tasks are complete, OR
- Max iterations are reached

Then it reports back. No babysitting required.

### Ralph Skills

#### taski-add

Generate stories and tasks from a feature description:

```
Load the taski-add skill and create stories/tasks for a user login feature
```

The skill creates Markdown stories and JSON tasks in your `.taski/` directory automatically.

---

## taski Details

### Why taski?

- **100% local** — Everything lives in your filesystem. No cloud, no accounts, no lock-in.
- **AI-friendly** — Stories and tasks are plain files (Markdown + JSON) that any agent can read, parse, and update.
- **Ralph-ready** — The `next` command returns a single pending task. Perfect for ralph agent loops.
- **Prevents AI accidents** - No "complete all tasks" text replacement. Your AI's fat fingers can't hit what isn't there.
- **Saves context** — Only reads one task per iteration. Your agent's context window isn't wasted on tasks it won't touch yet.
- **Flexible** — Configure custom paths for stories, tasks, and archives. Works with any project structure.

### Project Structure

```
.taski/
├── taski.json          # Configuration
├── tasks.json          # Active tasks (JSON)
├── tasks-archive/      # Archived tasks by year-month
└── stories/            # User stories (Markdown)
```

Default locations are `.taski/` in your project directory, but everything is configurable.

### Installation

```bash
bun install
bun link
```

### Initialize in Your Project

```bash
taski init
```

### Commands

#### Stories

```bash
# Create a story (content is full markdown)
taski stories create --shortStoryTitle "Story title" --projectPath "." --content "Full description..."

# List all stories
taski stories list

# Read a story (by filename from list output)
taski stories read S-001_TAC-001_story-title.md

# Update story content
taski stories update S-001_TAC-001_story-title.md --content "Updated content..."

# Delete a story
taski stories delete S-001_TAC-001_story-title.md
```

#### Tasks

```bash
# Create a task linked to a story
taski tasks create --title "Task title" --description "What to do" --acceptanceCriteria '["Test 1", "Test 2"]' --story "S-001_story-title.md" --projectPath "." --priority 1

# List all tasks
taski tasks list

# Read a task by ID
taski tasks read TAC-1

# Mark task complete
taski tasks update TAC-1 --completedAt now

# Get next pending task (for agent loops)
taski tasks next

# Delete a task
taski tasks delete TAC-1
```

**Priority** is a number — higher values appear first in `next`.

### Story Filenames

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

### Configuration

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

---

## Inspirations / Prior Work

- ["Ship working code while you sleep with the Ralph Wiggum technique"](https://www.youtube.com/watch?v=_IK18goX4X8)
- ["Matt Pocock on ralph-driven development"](https://x.com/mattpocockuk/status/2006807098076881312)
- ["Stop Chatting with AI. Start Loops (Ralph Driven Development)"](https://lukeparker.dev/stop-chatting-with-ai-start-loops-ralph-driven-development)
- ["Evan Otero on ralph"](https://x.com/EvanOtero/status/2009341616721436773)
- ["Ralph Wiggum as a 'software engineer'"](https://ghuntley.com/ralph/)
- ["Ralph - autonomous AI agent loop"](https://github.com/snarktank/ralph)
- ["Ryan Carson on ralph"](https://x.com/ryancarson/status/2008548371712135632)
