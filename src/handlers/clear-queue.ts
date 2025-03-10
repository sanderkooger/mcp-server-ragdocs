import type { Server } from '@modelcontextprotocol/sdk/server/index.js'
import type { ApiClient } from '../api-client.js'
import { ClearQueueTool } from '../lib/clear-queue.js'

export class ClearQueueHandler extends ClearQueueTool {
  constructor(server: Server, apiClient: ApiClient) {
    super()
  }

  async handle(args: any) {
    return this.execute(args)
  }
}
