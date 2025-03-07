import { BaseTool } from './base-tool.js'
import type { ToolDefinition, McpToolResponse } from '../types.js'
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import type { ApiClient } from '../api-client.js'
import { AddDocumentationHandler } from '../handlers/add-documentation.js'
import { Server } from '@modelcontextprotocol/sdk/server/index.js'

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const QUEUE_FILE = path.join(__dirname, '..', '..', 'queue.txt')

export class RunQueueTool extends BaseTool {
  private apiClient: ApiClient
  private addDocHandler: AddDocumentationHandler

  constructor(apiClient: ApiClient) {
    super()
    this.apiClient = apiClient
    // Create a temporary server instance just for the handler
    const tempServer = new Server(
      { name: 'temp', version: '0.0.0' },
      { capabilities: { tools: {} } }
    )
    this.addDocHandler = new AddDocumentationHandler(tempServer, apiClient)
  }

  get definition(): ToolDefinition {
    return {
      name: 'run_queue',
      description: 'Process URLs from the queue one at a time until complete',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }

  async execute(_args: any): Promise<McpToolResponse> {
    try {
      // Check if queue file exists
      try {
        await fs.access(QUEUE_FILE)
      } catch {
        return {
          content: [
            {
              type: 'text',
              text: 'Queue is empty (queue file does not exist)'
            }
          ]
        }
      }

      let processedCount = 0
      let failedCount = 0
      const failedUrls: string[] = []

      while (true) {
        // Read current queue
        const content = await fs.readFile(QUEUE_FILE, 'utf-8')
        const urls = content.split('\n').filter((url) => url.trim() !== '')

        if (urls.length === 0) {
          break // Queue is empty
        }

        const currentUrl = urls[0] // Get first URL

        try {
          // Process the URL using the handler
          await this.addDocHandler.handle({ url: currentUrl })
          processedCount++
        } catch (error) {
          failedCount++
          failedUrls.push(currentUrl!)
          console.error(`Failed to process URL ${currentUrl}:`, error)
        }

        // Remove the processed URL from queue
        const remainingUrls = urls.slice(1)
        await fs.writeFile(
          QUEUE_FILE,
          remainingUrls.join('\n') + (remainingUrls.length > 0 ? '\n' : '')
        )
      }

      let resultText = `Queue processing complete.\nProcessed: ${processedCount} URLs\nFailed: ${failedCount} URLs`
      if (failedUrls.length > 0) {
        resultText += `\n\nFailed URLs:\n${failedUrls.join('\n')}`
      }

      return {
        content: [
          {
            type: 'text',
            text: resultText
          }
        ]
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Failed to process queue: ${error}`
          }
        ],
        isError: true
      }
    }
  }
}
