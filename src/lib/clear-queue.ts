import { BaseTool } from './base-tool.js'
import type { ToolDefinition, McpToolResponse } from '../types.js'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const QUEUE_FILE = path.join(__dirname, '..', '..', 'queue.txt')

export class ClearQueueTool extends BaseTool {
  get definition(): ToolDefinition {
    return {
      name: 'clear_queue',
      description: 'Clear all URLs from the queue',
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
              text: 'Queue is already empty (queue file does not exist)'
            }
          ]
        }
      }

      // Read current queue to get count of URLs being cleared
      const content = await fs.readFile(QUEUE_FILE, 'utf-8')
      const urlCount = content
        .split('\n')
        .filter((url) => url.trim() !== '').length

      // Clear the queue by emptying the file
      await fs.writeFile(QUEUE_FILE, '')

      return {
        content: [
          {
            type: 'text',
            text: `Queue cleared successfully. Removed ${urlCount} URL${urlCount === 1 ? '' : 's'} from the queue.`
          }
        ]
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Failed to clear queue: ${error}`
          }
        ],
        isError: true
      }
    }
  }
}
