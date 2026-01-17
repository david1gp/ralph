## Tech Stack

- Bun as package manager and for cli scripts and tools
- Typescript

## Code

- use `stricli` for cli commands
  use context7 to get more information about `bloomberg/stricli`
  https://github.com/bloomberg/stricli/
- use `Result` type from `~utils/result/Result` to model return valules that can fail
- try to avoid try catches
- Import aliases
  - `utils` -> `node_modules/@adaptive-sm/utils/`

## Function Modularization

- Prefer `function` over `const` for functions
- Prefer early `if(!matching) return` over `if (matching)` checks
- Prefer early `if(!matching) continue` over `if (matching)` checks in for loops
- Break large functions into smaller, focused functions
- Each function should have a single responsibility
- Name functions clearly based on their purpose
- Keep functions pure when possible (no side effects)
- Avoid else statements where possible
