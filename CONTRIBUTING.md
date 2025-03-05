# Contribution Guide

Welcome! We appreciate your interest in contributing to the RAG Documentation MCP Server. Please follow these guidelines:

## Development Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/mcp-server-ragdocs.git
cd mcp-server-ragdocs
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

## Coding Standards

- Follow TypeScript best practices
- Use descriptive variable/method names
- Include JSDoc comments for public methods
- Keep functions focused (single responsibility principle)
- Write tests for new features using Jest

## Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org):

```
<type>(<scope>): <description>
```

Allowed types:

- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- chore: Maintenance tasks
- refactor: Code refactoring
- test: Test additions/modifications

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
