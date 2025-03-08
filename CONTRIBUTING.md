# Contribution Guide

Welcome! We appreciate your interest in contributing to the RAG Documentation MCP Server. Please follow these guidelines:

## Development Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/mcp-server-ragdocs.git
cd mcp-server-ragdocs
```

2. Install dependencies (npm required):

```bash
npm install
# Enforced by .npmrc engine-strict=true
```

3. Build the project:

```bash
npm run build
```

4. Format code with Prettier (using .prettierrc config):

```bash
npm run format
```

5. Check code quality with ESLint (using eslint.config.ts config):

gh auth

```bash
npm run lint
```

## Development Workflow

### Branch Strategy

- All changes must be made through feature branches (`feat/...`)
- Direct commits to main branch are blocked

### Commit Process

### Commit Validation Workflow

We enforce commit standards through:

- [Husky](https://typicode.github.io/husky/) pre-commit hooks
- [commitlint](https://commitlint.js.org/) message validation
- npm-enforced package manager via `.npmrc`

#### Hook Configuration

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
```

1. Stage changes with `git add`
2. Attempt commit - validation runs automatically
3. If rejected:
   - Fix message format
   - Retry commit

Example workflow:

```bash
git add .
git commit -m "invalid message" # Fails
git commit -m "feat: add validation workflow" # Succeeds
```

### Pull Requests

- Require 1+ approved review
- All CI checks must pass
- Enforce linear commit history

## Coding Standards

- Follow TypeScript best practices
- Use descriptive variable/method names
- Include JSDoc comments for public methods
- Keep functions focused (single responsibility principle)

### Testing Conventions

1. **File Structure**:

   - Test files must live adjacent to their implementation
   - Naming pattern: `[filename].test.ts`
   - Example:
     ```
     src/
       tools/
         base-tool.ts
         base-tool.test.ts
     ```

2. **Test Execution**:

   ```bash
   # Run all tests
   npm test

   # Run tests for specific file
   npm test src/tools/base-tool.test.ts

   # Generate coverage report
   npm run test:coverage
   ```

3. **Coverage Requirements**:

   - Minimum 80% branch coverage
   - Reports generated in /coverage
   - CI blocks PRs with reduced coverage

4. **Best Practices**:

   - Test files must mirror source folder structure
   - Use Jest's modern ESM syntax
   - Prefer `describe.each` for parameterized tests
   - Mock external dependencies using Jest's mocking system

5. **Example Test Structure**:

```typescript
// Example from src/tools/jestTestFunction.test.ts
import { jestTestFunction } from './jestTestFunction'

describe('jestTestFunction', () => {
  it('should return true for valid inputs', () => {
    // Arrange
    const input = { test: true }

    // Act
    const result = jestTestFunction(input)

    // Assert
    expect(result).toBe(true)
  })

  it('should handle edge cases', () => {
    // Test edge cases with proper mocking
    jest.spyOn(console, 'log').mockImplementation()

    expect(jestTestFunction(null)).toBe(false)
    expect(console.log).toHaveBeenCalledWith('Invalid input')
  })
})
```

7. **CI Integration**:
   - Tests run on GitHub Actions for all PRs
   - Coverage tracked via Codecov
   - Failure blocks merge

## Commit Message Format

We enforce [Conventional Commits](https://www.conventionalcommits.org) specification:

```
<type>(<scope>): <description>
```

### Allowed Types:

- chore: Maintenance tasks
- feat: New features
- fix: Bug fixes
- docs: Documentation changes
- style: Code formatting
- refactor: Code refactoring
- test: Test updates
- revert: Revert changes
- build: Build system updates
- ci: CI configuration changes

Examples:

```bash
feat: add documentation search endpoint
fix: resolve timeout issues in queue processing
docs: update API reference documentation
```

## Pull Request Process

1. Create a feature branch from `main`
2. Implement your changes
3. Run tests: `npm test`
4. Ensure linting passes: `npm run lint`
5. Push to your fork and open a PR
6. Include a clear description of changes
7. Reference any related issues

## Reporting Issues

- Use the GitHub issue tracker
- Include reproduction steps
- Specify expected vs actual behavior
- Add relevant code snippets/logs

## Code Review

- All PRs require maintainer approval
- Address review comments promptly
- Keep discussion focused on the code

## Release Process

This project uses semantic-release for automated version management:

- Commits must follow Conventional Commits specification
- Merges to `main` trigger automated releases
- Patch versions for `fix` commits
- Minor versions for `feat` commits
- Major versions for breaking changes (`BREAKING CHANGE` in footer)
