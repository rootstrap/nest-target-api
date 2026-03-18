---
applyTo: "src/**/*.ts"
---

# NestJS Review

## Architecture

- Controllers should be thin: delegate logic to services
- Services handle business logic, one responsibility per service
- Use dependency injection via constructor, never instantiate manually

## Validation

- All DTOs must use `class-validator` decorators
- Apply `ValidationPipe` on endpoints receiving user input
- Transform and whitelist incoming data

## Common Issues

- Missing `@Injectable()` on providers
- Business logic in controllers
- Circular dependencies between modules
- Missing guards on protected endpoints
- Not awaiting async operations

## Patterns

```typescript
// Good: thin controller
@Post()
create(@Body() dto: CreateDto) {
  return this.service.create(dto);
}

// Bad: logic in controller
@Post()
create(@Body() dto: CreateDto) {
  const validated = this.validate(dto);
  const result = this.transform(validated);
  return this.repository.save(result);
}
```
