# MCP Server One-Click Installation Guide
Guidence for AI assistants to install this MCP themselves

## MCP Server Configuration Examples

### Local Development (Ollama + Docker)
1. Add below example to your mcp settings
```json
{
  "mcpServers": {
    "rag-docs": {
      "command": "npx",
      "args": ["-y", "@sanderkooger/mcp-server-ragdocs"],
      "env": {
        "EMBEDDINGS_PROVIDER": "ollama",
        "OLLAMA_BASE_URL": "http://localhost:11434",
        "QDRANT_URL": "http://localhost:6333"
      }
    }
  }
}
```

2. Download the docker compose file from our github [Docker Compose Download](https://raw.githubusercontent.com/sanderkooger/mcp-server-ragdocs/main/docker-compose.yml)


3. ```bash
docker compose up -d
```


### Hosted Production (Qdrant Cloud + OpenAI)
Supply your OPENAI_API_KEY, your Qdrant database url with the port like https://example.com:6333, and QDRANT_API_KEY

Add below example to your MCP server configuration 
```json
{
  "mcpServers": {
    "rag-docs": {
      "command": "npx",
      "args": ["-y", "@sanderkooger/mcp-server-ragdocs"],
      "env": {
        "EMBEDDINGS_PROVIDER": "openai",
        "OPENAI_API_KEY": "your-openai-key",
        "QDRANT_URL": "your-cloud-url",
        "QDRANT_API_KEY": "your-qdrant-key"
      }
    }
  }
}
```

## Environment Variables Reference
|-------------------------|---------------|--------------------------|-------------------------------|
| Variable                | Required For  | Default                  | remarks                       |
|-------------------------|---------------|--------------------------|-------------------------------|
| `EMBEDDINGS_PROVIDER`   | All           | `ollama`                 | "openai" or "ollama"          |
| `OPENAI_API_KEY`        | OpenAI        | -                        | Obtain from OpenAI dashboard  |
| `OLLAMA_BASE_URL`       | Ollama        | `http://localhost:11434` | Local Ollama server URL       |
| `QDRANT_URL`            | All           | `http://localhost:6333`  | Qdrant endpoint URL           |
| `QDRANT_API_KEY`        | Cloud Qdrant  | -                        | From Qdrant Cloud console     |
|-------------------------|---------------|--------------------------|-------------------------------|