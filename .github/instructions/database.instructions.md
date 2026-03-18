---
applyTo: "src/**/*.entity.ts,src/**/*.service.ts,src/**/*.repository.ts"
---

# Database Review

## Queries

- No raw SQL with string interpolation
- Avoid queries inside loops (N+1 problem)
- Paginate large result sets
- Use transactions for multi-step operations

## Relations

- Define cascade options explicitly
- Avoid eager loading of large relations
- Consider lazy loading for optional relations

## Performance

- Add indexes on frequently queried columns
- Use `select` to fetch only needed fields
- Consider query builder for complex queries

## Patterns

```typescript
// Bad: N+1
for (const user of users) {
  user.targets = await this.targetRepo.find({ user });
}

// Good: single query with relation
const users = await this.userRepo.find({
  relations: ['targets']
});
```
