# MCP RAG Documentation Server Architecture

## File Structure

```
mcp-server-ragdocs/
├── src/
│   ├── api-client.ts        # Qdrant vector database client
│   ├── handler-registry.ts  # MCP request handler registration
│   ├── index.ts             # Server entry point
│   ├── types.ts             # Type definitions
│   └── handlers/            # MCP tool implementations
│       ├── add-documentation.ts
│       ├── base-handler.ts
│       ├── clear-queue.ts
│       ├── extract-urls.ts
│       ├── index.ts
│       ├── list-queue.ts
│       ├── list-sources.ts
│       ├── remove-documentation.ts
│       └── run-queue.ts
└── tools/                  # MCP tool definitions
    ├── base-tool.ts
    ├── clear-queue.ts
    ├── extract-urls.ts
    ├── index.ts
    ├── list-queue.ts
    ├── list-sources.ts
    ├── remove-documentation.ts
    ├── run-queue.ts
    └── search-documentation.ts
```

## Key Components

### Vector Database Integration

- Uses Qdrant vector database for efficient similarity search
- Handles document embeddings storage and retrieval
- Supports multiple embedding providers (OpenAI, Ollama)

### MCP Handlers

- Implements Model Context Protocol specifications
- Process documentation URLs and content
- Queue system for batch processing

### Search System

- Semantic search using vector embeddings
- Hybrid search combining keyword and vector approaches
- Context-aware result ranking

## Data Flow

1. Documentation URLs added via `extract_urls` tool
2. URLs queued for processing
3. Content fetched and parsed
4. Text chunks embedded using selected provider
5. Vectors stored in Qdrant
6. Queries processed through semantic search

## Design Decisions

- Modular architecture for easy embedding provider swaps
- Batch processing for scalability
- Type-safe implementation with TypeScript
- Convention-over-configuration for handler registration
