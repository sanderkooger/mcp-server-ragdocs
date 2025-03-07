# [1.2.0](https://github.com/sanderkooger/mcp-server-ragdocs/compare/v1.1.4...v1.2.0) (2025-03-07)


### Bug Fixes

* installed semantic-versioning plugins in package.json ([c8702d5](https://github.com/sanderkooger/mcp-server-ragdocs/commit/c8702d53686cb92d65d135edaa2e06226bc1c43b))


### Features

* add test file ([a478fc9](https://github.com/sanderkooger/mcp-server-ragdocs/commit/a478fc9f223af9756d18296fcabba2163db21f0a))

# Changelog

## [1.1.2] - 2025-03-05

### Added

- Strict TypeScript configuration
  - Enabled all strict type-checking options
  - Added explicit type annotations throughout codebase

### Changed

- Updated README documentation
  - Added configuration details for strict TypeScript
  - Improved tool descriptions
  - Enhanced setup instructions

## [1.1.1] - 2025-03-04

### Added

- Ollama support for embeddings generation
  - Integrated with Ollama API endpoints
  - Added EMBEDDINGS_PROVIDER and OLLAMA_BASE_URL environment variables

### Changed

- Updated environment variable requirements
  - Now requires EMBEDDINGS_PROVIDER and OLLAMA_BASE_URL for embeddings
  - Documented variables in README.md and configuration files

## [1.1.0] - 2024-03-14

### Initial Feature Addition

- Implemented new clear_queue tool for queue management
  - Created src/tools/clear-queue.ts with core functionality
  - Added handler in src/handlers/clear-queue.ts
  - Integrated with existing queue management system
  - Added tool exports and registration

### Code Organization

- Improved tool ordering in handler-registry.ts
  - Moved remove_documentation before extract_urls
  - Enhanced logical grouping of related tools
  - Updated imports to match new ordering

### Documentation Enhancement Phase 1

- Enhanced tool descriptions in handler-registry.ts:
  1. search_documentation
     - Added natural language query support details
     - Clarified result ranking and context
     - Improved limit parameter documentation
  2. list_sources
     - Added details about indexed documentation
     - Clarified source information returned
  3. extract_urls
     - Enhanced URL crawling explanation
     - Added queue integration details
     - Clarified URL validation requirements
  4. remove_documentation
     - Added permanence warning
     - Clarified URL matching requirements
  5. list_queue
     - Added queue monitoring details
     - Clarified status checking capabilities
  6. run_queue
     - Added processing behavior details
     - Documented error handling
  7. clear_queue
     - Detailed queue clearing behavior
     - Added permanence warnings
     - Documented URL re-adding requirements

### Documentation Enhancement Phase 2

- Updated README.md
  - Removed add_documentation and queue_documentation tools
  - Updated tool descriptions to match handler-registry.ts
  - Added parameter format requirements
  - Enhanced usage guidance
