import { QdrantClient } from "@qdrant/js-client-rest";
import OpenAI from "openai";
import { Ollama } from "ollama";
import { chromium } from "playwright";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

// Environment variables for configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
const EMBEDDINGS_PROVIDER = process.env.EMBEDDINGS_PROVIDER || "ollama";
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL;

if (!QDRANT_URL) {
  throw new Error(
    "QDRANT_URL environment variable is required for cloud storage"
  );
}

if (!QDRANT_API_KEY) {
  throw new Error(
    "QDRANT_API_KEY environment variable is required for cloud storage"
  );
}

export class ApiClient {
  qdrantClient: QdrantClient;
  openaiClient?: OpenAI;
  ollamaClient?: Ollama;
  browser: any;

  constructor() {
    // Initialize Qdrant client with cloud configuration
    this.qdrantClient = new QdrantClient({
      url: QDRANT_URL,
      apiKey: QDRANT_API_KEY,
    });

    // Initialize OpenAI client if API key is provided
    if (EMBEDDINGS_PROVIDER === "openai" && OPENAI_API_KEY) {
      this.openaiClient = new OpenAI({
        apiKey: OPENAI_API_KEY,
      });
    }
    // Initialize OpenAI client if API key is provided
    if (EMBEDDINGS_PROVIDER === "ollama") {
      // FIX TO CREATE OLLAMA CLIENT PROPPER
      this.ollamaClient = new Ollama({
        host: OLLAMA_BASE_URL || "http://127.0.0.1:11434",
      });
    }
  }

  async initBrowser() {
    if (!this.browser) {
      this.browser = await chromium.launch();
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async getEmbeddings(text: string): Promise<number[]> {
    if (EMBEDDINGS_PROVIDER == "openai" && !this.openaiClient) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        "OpenAI API key not configured"
      );
    }
    if (EMBEDDINGS_PROVIDER == "ollama" && !this.ollamaClient) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        "ollama URL not configured, or ollama is not running"
      );
    }

    // get embeddings using OpenAI Client
    if (this.openaiClient) {
      try {
        const response = await this.openaiClient.embeddings.create({
          model: "text-embedding-ada-002",
          input: text,
        });
        return response.data[0].embedding;
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to generate embeddingsusing openai: ${error}`
        );
      }
    }
    // get embeddings using Ollama
    if (this.ollamaClient) {
      try {
        const response = await this.ollamaClient.embeddings({
          model: "nomic-embed-text",
          prompt: text,
        });
        return response.embedding;
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to generate embeddings using ollama: ${error}`
        );
      }
    }
    // Handle unexpected case
    throw new McpError(
      ErrorCode.InternalError,
      "No valid embeddings provider configured"
    );
  }

  async initCollection(COLLECTION_NAME: string) {
    try {
      const collections = await this.qdrantClient.getCollections();
      const exists = collections.collections.some(
        (c) => c.name === COLLECTION_NAME
      );

      if (!exists) {
        await this.qdrantClient.createCollection(COLLECTION_NAME, {
          vectors: {
            size: EMBEDDINGS_PROVIDER === "openai" ? 1536 : 768, // OpenAI ada-002 (1536) or Ollama nomic-embed-text (768)
            distance: "Cosine",
          },
          // Add optimized settings for cloud deployment
          optimizers_config: {
            default_segment_number: 2,
            memmap_threshold: 20000,
          },
          replication_factor: 2,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("unauthorized")) {
          throw new McpError(
            ErrorCode.InvalidRequest,
            "Failed to authenticate with Qdrant cloud. Please check your API key."
          );
        } else if (
          error.message.includes("ECONNREFUSED") ||
          error.message.includes("ETIMEDOUT")
        ) {
          throw new McpError(
            ErrorCode.InternalError,
            "Failed to connect to Qdrant cloud. Please check your QDRANT_URL."
          );
        }
      }
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to initialize Qdrant cloud collection: ${error}`
      );
    }
  }
}
