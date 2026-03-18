---
applyTo: "src/test/**/*,**/*.spec.ts,**/*.e2e-spec.ts"
---

# Testing Review

## Test Quality

- Tests must clean up in afterEach (close connections, clear data)
- No hardcoded credentials or real secrets
- Test edge cases: empty, null, boundaries
- Test error paths, not just happy path

## Isolation

- No shared mutable state between tests
- Tests must not depend on execution order
- Each test should set up its own data

## Assertions

- Assert behavior, not implementation details
- Use descriptive assertion messages
- One logical assertion per test

## Async

```typescript
// Good: proper async handling
await expect(service.create(dto)).rejects.toThrow();

// Bad: missing await
expect(service.create(dto)).rejects.toThrow();
```
