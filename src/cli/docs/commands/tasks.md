# Task Commands

The `taski tasks` command group provides commands for managing tasks.

## Commands

### list

List all tasks as JSON.

```bash
taski tasks list
```

**Output:** JSON array of all tasks

**Example:**
```bash
$ taski tasks list
[
  {
    "id": "T-001",
    "title": "Set up project structure",
    "passes": true,
    ...
  }
]
```

---

### read

Read a specific task by ID.

```bash
taski tasks read <id>
```

**Arguments:**
- `id` - Task ID (e.g., T-001)

**Example:**
```bash
$ taski tasks read T-001
{
  "id": "T-001",
  "title": "Set up project structure",
  "passes": true,
  ...
}
```

**Error:** `Task "T-999" not found` if the task doesn't exist

---

### create

Create a new task with the given title.

```bash
taski tasks create <title>
```

**Arguments:**
- `title` - Task title (required)

**Example:**
```bash
$ taski tasks create "Implement user authentication"
Task "T-011" created successfully
```

**Notes:**
- The new task is created with default values for all fields
- The task ID is automatically generated based on the current task count
- The task is initialized with `passes: false`

---

### update

Update a task's properties.

```bash
taski tasks update <id> [--passes true|false]
```

**Arguments:**
- `id` - Task ID (e.g., T-001)

**Flags:**
- `--passes` - Mark the task as passing or failing (boolean)

**Example:**
```bash
# Mark a task as complete
$ taski tasks update T-001 --passes true
Task "T-001" updated successfully

# Mark a task as incomplete
$ taski tasks update T-002 --passes false
Task "T-002" updated successfully
```

**Notes:**
- Only the `--passes` flag is currently supported
- Other properties can be updated by editing tasks.json directly

---

### next

Show the next pending task (the first task with `passes: false`).

```bash
taski tasks next
```

**Example:**
```bash
$ taski tasks next
{
  "id": "T-004",
  "title": "Implement core tasks module",
  "passes": false,
  ...
}
```

**Output:** If no pending tasks exist, outputs: `No pending tasks found`

---

### delete

Delete a task by ID.

```bash
taski tasks delete <id>
```

**Arguments:**
- `id` - Task ID (e.g., T-001)

**Example:**
```bash
$ taski tasks delete T-010
Task "T-010" deleted successfully
```

**Error:** `Task "T-999" not found` if the task doesn't exist

**Warning:** This action cannot be undone. The task is permanently removed.

## Common Workflows

### Working Through Tasks

```bash
# See what needs to be done
taski tasks next

# Read the task details
taski tasks read T-004

# Mark as complete when done
taski tasks update T-004 --passes true

# See what's next
taski tasks next
```

### Finding Incomplete Tasks

```bash
# List all tasks and look for passes: false
taski tasks list | grep '"passes": false'

# Or use next to get the first one
taski tasks next
```

### Bulk Operations

To mark multiple tasks as complete, update them individually:

```bash
taski tasks update T-001 --passes true
taski tasks update T-002 --passes true
taski tasks update T-003 --passes true
```

## Task Properties

Tasks have the following structure:

```json
{
  "id": "T-001",
  "dir": "/path/to/project",
  "title": "Task title",
  "description": "Task description",
  "acceptanceCriteria": [" criterion 1", "criterion 2"],
  "priority": 1,
  "passes": false,
  "notes": "Additional notes"
}
```

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique task identifier (e.g., T-001) |
| `dir` | string | Project directory for the task |
| `title` | string | Short task title |
| `description` | string | Detailed task description |
| `acceptanceCriteria` | string[] | List of acceptance criteria |
| `priority` | number | Task priority (lower = higher priority) |
| `passes` | boolean | Whether the task is complete |
| `notes` | string | Additional notes |
