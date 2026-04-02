---
name: taski-add
description: "Create a new user story and generate its tasks with taski cli. Trigger: taski-add"
---

# Create Story and Tasks

Create a new feature story and generate all its tasks as new entries in the taski CLI.

---

## The Job

1. Understand Story: Ask clarifying questions to reach 100% clarity
2. Generate Tasks: Divide the user story in isolated and actionable implementation tasks
3. Save story md description in projects docs dir
4. Create user story via `taski stories create --fromFile`
5. Create each task via `taski tasks create`

---

## Step 1: Clarifying Questions

Ask only critical questions where the initial prompt is ambiguous. Focus on:

- **Project:** What project directory does this belong to?
- **Feature:** What is the feature called?
- **Goal:** What problem does this solve?
- **Scope:** MVP or full-featured?
- **Constraints:** Any existing systems to integrate with?

### Format

```
1. Which project is this for?
   A. adaptive-astro-ui
   B. adaptive-cf-b2-proxy
   C. adaptive-convex-auth
   D. [please specify]
```

This lets users respond with "1A" for quick iteration.

---

## 2. Propose tasks

### Task Sizing Rule

An junior developer or an autonomuos agent spawns a fresh opencode instance per iteration with no memory of previous work.

### Right-sized tasks:

- Add a database column and migration
- Add a UI component to an existing page
- Update a server action with new logic
- Add a filter dropdown to a list

### Too big (split these):

- "Build the entire dashboard" - Split into: schema, queries, UI components, filters
- "Add authentication" - Split into: schema, middleware, login UI, session handling

### Task Ordering: Dependencies First

1. Data/Schema/database changes (migrations)
2. Server actions / backend logic
3. UI components that use the backend
4. Dashboard/summary views that aggregate data

### Acceptance Criteria Rules

Each criterion must be verifiable, not vague.

### Bad criteria (vague):

- "Works correctly"
- "User can do X easily"
- "Good UX"

### Good criteria (verifiable):

- "Add `status` column to tasks table with default 'pending'"
- "Filter dropdown has options: All, Active, Completed"
- "Clicking delete shows confirmation dialog"

### Always include acceptance criterias:

```
"bun run tsc passes"
"bun test passes"
```

---

## Step 3: Generate Story Markdown

Create a user story.

The User Story reader may be a junior developer or AI agent. Therefore:

- Be explicit and unambiguous
- Avoid jargon or explain it
- Provide enough detail to understand purpose and core logic
- Number requirements for easy reference
- Use concrete examples where helpful

use taski cli, example:

```bash
taski stories create \
  --shortTitle "dark-mode" \
  --content "Content..."
-> "returns the filename, required later for task creation"
```

---

## Step 4: Create Tasks

### Task Sizing Rule

**Each task must be completable in ONE agent iteration (one context window).**

Ralph spawns a fresh opencode instance per iteration with no memory of previous work.

### Right-sized tasks:

- Add a database column and migration
- Add a UI component to an existing page
- Update a server action with new logic
- Add a filter dropdown to a list

### Too big (split these):

- "Build the entire dashboard" - Split into: schema, queries, UI components, filters
- "Add authentication" - Split into: schema, middleware, login UI, session handling

### Task ordering: dependencies First

1. Schema/database changes (migrations)
2. Server actions / backend logic
3. UI components that use the backend
4. Dashboard/summary views that aggregate data

### Command for each task:

```bash
taski tasks create \
  --title "{title}" \
  --description "{description}" \
  --acceptanceCriteria '["criterion1", "criterion2", "bun run tsc passes"]' \
  --story "{story-filename-from-taski-stories-create}"
```

### Acceptance Criteria Rules

Each criterion must be verifiable, not vague.

### Good criteria (verifiable):
- "Add `status` column to tasks table with default 'pending'"
- "Filter dropdown has options: All, Active, Completed"
- "Clicking delete shows confirmation dialog"
- "bun run tsc passes"

### Bad criteria (vague):
- "Works correctly"
- "User can do X easily"
- "Good UX"

### Always include:

- `bun run tsc` passes
- `bun test` passes
