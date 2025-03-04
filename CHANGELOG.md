# Changelog

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
