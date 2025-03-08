# MCP-server_ragdocs

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Tools](#tools)
- [Deployment](#deployment)
  - [Local Development](#local-development)
  - [Cloud Deployment](#cloud-deployment)
- [Configuration](#configuration)
- [Using Ollama Embeddings](#using-ollama-embeddings)
- [License](#license)
- [Contributing](#contributing)
- [Forkception Acknowledgments](#forkception-acknowledgments)

[![Node.js Package](https://github.com/sanderkooger/mcp-server-ragdocs/actions/workflows/release.yml/badge.svg)](https://github.com/sanderkooger/mcp-server-ragdocs/actions/workflows/npm-publish.yml)
![NPM Downloads](https://img.shields.io/npm/dy/%40sanderkooger%2Fmcp-server-ragdocs)
[![Version](https://img.shields.io/npm/v/@sanderkooger/mcp-server-ragdocs)](https://npmjs.com/package/@sanderkooger/mcp-server-ragdocs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An MCP server implementation that provides tools for retrieving and processing documentation through vector search, enabling AI assistants to augment their responses with relevant documentation context.

## Features

- Vector-based documentation search and retrieval
- Support for multiple documentation sources
- Semantic search capabilities
- Automated documentation processing
- Real-time context augmentation for LLMs

## Project Structure

The package follows a modular architecture with clear separation between core components and MCP protocol handlers. See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed structural documentation and design decisions.

## Tools

### search_documentation

Search through stored documentation using natural language queries. Returns matching excerpts with context, ranked by relevance.

**Inputs:**

- `query` (string): The text to search for in the documentation. Can be a natural language query, specific terms, or code snippets.
- `limit` (number, optional): Maximum number of results to return (1-20, default: 5). Higher limits provide more comprehensive results but may take longer to process.

### list_sources

List all documentation sources currently stored in the system. Returns a comprehensive list of all indexed documentation including source URLs, titles, and last update times. Use this to understand what documentation is available for searching or to verify if specific sources have been indexed.

### extract_urls

Extract and analyze all URLs from a given web page. This tool crawls the specified webpage, identifies all hyperlinks, and optionally adds them to the processing queue.

**Inputs:**

- `url` (string): The complete URL of the webpage to analyze (must include protocol, e.g., https://). The page must be publicly accessible.
- `add_to_queue` (boolean, optional): If true, automatically add extracted URLs to the processing queue for later indexing. Use with caution on large sites to avoid excessive queuing.

### remove_documentation

Remove specific documentation sources from the system by their URLs. The removal is permanent and will affect future search results.

**Inputs:**

- `urls` (string[]): Array of URLs to remove from the database. Each URL must exactly match the URL used when the documentation was added.

### list_queue

List all URLs currently waiting in the documentation processing queue. Shows pending documentation sources that will be processed when run_queue is called. Use this to monitor queue status, verify URLs were added correctly, or check processing backlog.

### run_queue

Process and index all URLs currently in the documentation queue. Each URL is processed sequentially, with proper error handling and retry logic. Progress updates are provided as processing occurs. Long-running operations will process until the queue is empty or an unrecoverable error occurs.

### clear_queue

Remove all pending URLs from the documentation processing queue. Use this to reset the queue when you want to start fresh, remove unwanted URLs, or cancel pending processing. This operation is immediate and permanent - URLs will need to be re-added if you want to process them later.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Tools](#tools)
- [Usage](#usage)
- [Deployment](#deployment)
  - [Local Development](#local-development)
  - [Cloud Deployment](#cloud-deployment)
- [Configuration](#configuration)
- [Using Ollama Embeddings](#using-ollama-embeddings)
- [License](#license)
- [Contributing](#contributing)
- [Forkception Acknowledgments](#forkception-acknowledgments)

## Deployment

### Local Deployment

The repository includes Docker Compose configuration for local development:

```bash
docker compose up -d
```

This starts:

- Qdrant vector database on port 6333
- Ollama LLM service on port 11434

Access endpoints:

- Qdrant: http://localhost:6333
- Ollama: http://localhost:11434

### Cloud Deployment

For production deployments:

1. Use hosted Qdrant Cloud service
2. Set these environment variables:

```bash
QDRANT_URL=your-cloud-cluster-url
QDRANT_API_KEY=your-cloud-api-key
```

## Usage

The RAG Documentation tool is designed for:

- Enhancing AI responses with relevant documentation
- Building documentation-aware AI assistants
- Creating context-aware tooling for developers
- Implementing semantic documentation search
- Augmenting existing knowledge bases

## Configuration

}

```json
{
  "mcpServers": {
    "rag-docs": {
      "command": "npx",
      "args": ["-y", "@sanderkooger/mcp-server-ragdocs"],
      "env": {
        "EMBEDDINGS_PROVIDER": "ollama",
        "QDRANT_URL": "your-qdrant-url",
        "QDRANT_API_KEY": "your-qdrant-key"
      }
    }
  }
}
```

### Usage with Claude Desktop

Add this to your `claude_desktop_config.json`:

### OpenAI Configuration

```json
{
  "mcpServers": {
    "rag-docs-openai": {
      "command": "npx",
      "args": ["-y", "@sanderkooger/mcp-server-ragdocs"],
      "env": {
        "EMBEDDINGS_PROVIDER": "openai",
        "OPENAI_API_KEY": "your-openai-key-here",
        "QDRANT_URL": "your-qdrant-url",
        "QDRANT_API_KEY": "your-qdrant-key"
      }
    }
  }
}
```

### Ollama Configuration

```json
{
  "mcpServers": {
    "rag-docs-ollama": {
      "command": "npx",
      "args": ["-y", "@sanderkooger/mcp-server-ragdocs"],
      "env": {
        "EMBEDDINGS_PROVIDER": "ollama",
        "OLLAMA_BASE_URL": "http://localhost:11434",
        "QDRANT_URL": "your-qdrant-url",
        "QDRANT_API_KEY": "your-qdrant-key"
      }
    }
  }
}
```

You'll need to provide values for the following environment variables:

- `EMBEDDINGS_PROVIDER`: "openai" or "ollama" (default: "ollama")
- `OPENAI_API_KEY`: Required for OpenAI embeddings
- `OLLAMA_BASE_URL`: Base URL for Ollama (default: http://127.0.0.1:11434)
- `QDRANT_URL`: URL of your Qdrant vector database instance
- `QDRANT_API_KEY`: API key for authenticating with Qdrant

## Using Ollama Embeddings

1. Install Ollama:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

2. Download the nomic-embed-text model:

```bash
ollama pull nomic-embed-text
```

3. Verify installation:

```bash
ollama list
```

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.

## Development Workflow

1. Install dependencies:

```bash
npm install
```

2. Make your changes following the coding standards in CONTRIBUTING.md

3. Commit changes using Commitizen:

```bash
npm run commit
```

4. Push to your feature branch:

```bash
git push origin feat/your-feature
```

5. Create a pull request through GitHub's interface

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines, but here are the basics:

1. Fork the repository
2. Install dependencies: `npm install`
3. Create a feature branch: `git checkout -b feat/your-feature`
4. Commit changes following [Conventional Commits](https://www.conventionalcommits.org)
5. Push to your fork and open a PR

## Forkception Acknowledgments

This project is based on a fork of [hannesrudolph/mcp-ragdocs](https://github.com/hannesrudolph/mcp-ragdocs), which itself was forked from the original work by [qpd-v/mcp-ragdocs](https://github.com/qpd-v/mcp-ragdocs). The original project provided the foundation for this implementation.
