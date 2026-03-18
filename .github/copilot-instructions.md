# Code Review Guidelines

## Review Priorities

- **CRITICAL**: Security vulnerabilities, logic errors, breaking changes, data loss
- **IMPORTANT**: Missing validation, poor error handling, performance issues
- **SUGGESTION**: Readability, minor optimizations

## Review Principles

- Be specific: reference exact lines and variables
- Provide context: explain why something is problematic
- Suggest solutions: show the fix, not just the problem
- Be constructive: focus on code, not the author

## Always Check

- No hardcoded secrets or credentials
- User input validated before use
- Errors handled appropriately
- Async operations properly awaited

## Ignore

- Formatting issues (handled by Prettier/ESLint)
- Minor naming preferences
- Style choices already consistent in codebase
