import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError
} from '@modelcontextprotocol/sdk/types.js'
import type { Server } from '@modelcontextprotocol/sdk/server/index.js'
import type { ApiClient } from './api-client.js'
import type { ToolDefinition } from './types.js'
import {
  AddDocumentationHandler,
  SearchDocumentationHandler,
  ListSourcesHandler,
  RemoveDocumentationHandler,
  ExtractUrlsHandler,
  ListQueueHandler,
  RunQueueHandler,
  ClearQueueHandler
} from './handlers/index.js'

const COLLECTION_NAME = 'documentation'

export class HandlerRegistry {
  private server: Server
  private apiClient: ApiClient
  private handlers: Map<string, any>

  constructor(server: Server, apiClient: ApiClient) {
    this.server = server
    this.apiClient = apiClient
    this.handlers = new Map()
    this.setupHandlers()
    this.registerHandlers()
  }

  private setupHandlers() {
    this.handlers.set(
      'add_documentation',
      new AddDocumentationHandler(this.server, this.apiClient)
    )
    this.handlers.set(
      'search_documentation',
      new SearchDocumentationHandler(this.server, this.apiClient)
    )
    this.handlers.set(
      'list_sources',
      new ListSourcesHandler(this.server, this.apiClient)
    )
    this.handlers.set(
      'remove_documentation',
      new RemoveDocumentationHandler(this.server, this.apiClient)
    )
    this.handlers.set(
      'extract_urls',
      new ExtractUrlsHandler(this.server, this.apiClient)
    )
    this.handlers.set(
      'list_queue',
      new ListQueueHandler(this.server, this.apiClient)
    )
    this.handlers.set(
      'run_queue',
      new RunQueueHandler(this.server, this.apiClient)
    )
    this.handlers.set(
      'clear_queue',
      new ClearQueueHandler(this.server, this.apiClient)
    )
  }

  private registerHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'search_documentation',
          description:
            'Search through stored documentation using natural language queries. Use this tool to find relevant information across all stored documentation sources. Returns matching excerpts with context, ranked by relevance. Useful for finding specific information, code examples, or related documentation.',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description:
                  'The text to search for in the documentation. Can be a natural language query, specific terms, or code snippets.'
              },
              limit: {
                type: 'number',
                description:
                  'Maximum number of results to return (1-20). Higher limits provide more comprehensive results but may take longer to process. Default is 5.',
                default: 5
              }
            },
            required: ['query']
          }
        } as ToolDefinition,
        {
          name: 'list_sources',
          description:
            'List all documentation sources currently stored in the system. Returns a comprehensive list of all indexed documentation including source URLs, titles, and last update times. Use this to understand what documentation is available for searching or to verify if specific sources have been indexed.',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        } as ToolDefinition,
        {
          name: 'extract_urls',
          description:
            'Extract and analyze all URLs from a given web page. This tool crawls the specified webpage, identifies all hyperlinks, and optionally adds them to the processing queue. Useful for discovering related documentation pages, API references, or building a documentation graph. Handles various URL formats and validates links before extraction.',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description:
                  'The complete URL of the webpage to analyze (must include protocol, e.g., https://). The page must be publicly accessible.'
              },
              add_to_queue: {
                type: 'boolean',
                description:
                  'If true, automatically add extracted URLs to the processing queue for later indexing. This enables recursive documentation discovery. Use with caution on large sites to avoid excessive queuing.',
                default: false
              }
            },
            required: ['url']
          }
        } as ToolDefinition,
        {
          name: 'remove_documentation',
          description:
            'Remove specific documentation sources from the system by their URLs. Use this tool to clean up outdated documentation, remove incorrect sources, or manage the documentation collection. The removal is permanent and will affect future search results. Supports removing multiple URLs in a single operation.',
          inputSchema: {
            type: 'object',
            properties: {
              urls: {
                type: 'array',
                items: {
                  type: 'string',
                  description:
                    'The complete URL of the documentation source to remove. Must exactly match the URL used when the documentation was added.'
                },
                description: 'Array of URLs to remove from the database'
              }
            },
            required: ['urls']
          }
        } as ToolDefinition,
        {
          name: 'list_queue',
          description:
            'List all URLs currently waiting in the documentation processing queue. Shows pending documentation sources that will be processed when run_queue is called. Use this to monitor queue status, verify URLs were added correctly, or check processing backlog. Returns URLs in the order they will be processed.',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        } as ToolDefinition,
        {
          name: 'run_queue',
          description:
            'Process and index all URLs currently in the documentation queue. Each URL is processed sequentially, with proper error handling and retry logic. Progress updates are provided as processing occurs. Use this after adding new URLs to ensure all documentation is indexed and searchable. Long-running operations will process until the queue is empty or an unrecoverable error occurs.',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        } as ToolDefinition,
        {
          name: 'clear_queue',
          description:
            'Remove all pending URLs from the documentation processing queue. Use this to reset the queue when you want to start fresh, remove unwanted URLs, or cancel pending processing. This operation is immediate and permanent - URLs will need to be re-added if you want to process them later. Returns the number of URLs that were cleared from the queue.',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        } as ToolDefinition
      ]
    }))

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      await this.apiClient.initCollection(COLLECTION_NAME)

      const handler = this.handlers.get(request.params.name)
      if (!handler) {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        )
      }

      const response = await handler.handle(request.params.arguments)
      return {
        _meta: {},
        ...response
      }
    })
  }
}
