Create plan:

I want to create a cli tool to handle stories and tasks.

Tasks file:
/home/david/Coding/personal-taski-cli/tasks/tasks.json

Stories folder:
/home/david/Coding/personal-taski-cli/stories

Typescript code location
/home/david/Coding/personal-taski-cli/src/cli

Project should be written in Typescript, should use Bun as runtime.

configure the location of tasksFile and storiesFolder in .env so it can be imported and changed in this central location with ease.

create data types and schemas into the following dir
/home/david/Coding/personal-taski-cli/src/cli/data

acceptance criteria
- create internal core logic functions that: are used in the command line and can be imported and called in tests
- bun run tsc passes
- existing tests for each cli function
- all test pass
- cli documentation, usage, for each param or functionality

## libraries

### cli

The following cli library should be used
bloomberg/stricli/
@stricli/core
https://github.com/bloomberg/stricli
use context7 mcp to get information about it if needed

## runtime validation

valibot
you can look at dcc-app project for examples of its usage

## I want the following
- name of the cli: "taski"
- crud operations for stories and tasks: list, read, create
- ex. stories list -> should list content of /home/david/Coding/personal-taski-cli/stories
- ex. tasks list -> should list entries of /home/david/Coding/personal-taski-cli/tasks/tasks.json
- "taski tasks next" -> should get task with passes=false
- "taski tasks update ABC-123 --passes true" -> should update task ABC-123 passes to true

## example cli usage syntax

```bash
# Show available tools
linearis

# Show available sub-tools
linearis issues
linearis labels

# List recent issues
linearis issues list -l 10

# Create new issue with labels and assignment
linearis issues create "Fix login timeout" --team Backend --assignee user123 \
  --labels "Bug,Critical" --priority 1 --description "Users can't stay logged in"

# Read issue details (supports ABC-123 format)  
linearis issues read DEV-456

# Update issue status and priority
linearis issues update ABC-123 --status "In Review" --priority 2

```
