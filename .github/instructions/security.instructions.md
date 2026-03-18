---
applyTo: "src/auth/**/*,src/**/*.guard.ts,src/**/*.strategy.ts"
---

# Security Review (OWASP)

## Authentication

- JWT secrets must come from environment variables
- Passwords must be hashed with bcrypt (min 10 rounds)
- Never log or return passwords in responses
- All protected endpoints must use AuthGuard

## Injection Prevention

- Use parameterized queries, never string concatenation
- Validate and sanitize all user input
- Escape data before rendering in responses

## Access Control

- Apply principle of least privilege
- Verify user owns the resource before operations
- Use guards for authorization, not just authentication

## Session & Tokens

- Set appropriate token expiration
- Implement rate limiting on auth endpoints
- Use secure cookie attributes (HttpOnly, Secure, SameSite)

## Secrets

```typescript
// Good
const secret = process.env.JWT_SECRET;

// Bad
const secret = 'my-secret-key';
```
