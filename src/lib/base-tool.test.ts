import { expect, assert } from 'chai';
import { BaseTool } from './base-tool.js'
import type { ToolDefinition, McpToolResponse } from '../types.js'

class MockTool extends BaseTool {
  get definition(): ToolDefinition {
    return {
      name: 'mock',
      description: 'mock tool',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }

  async execute(): Promise<McpToolResponse> {
    return this.formatResponse({ success: true })
  }

  // Expose protected methods for testing
  public testFormat(data: unknown) {
    return this.formatResponse(data)
  }

  public testError(error: Error) {
    return this.handleError(error)
  }
}

describe('BaseTool', () => {
  let tool: MockTool

  beforeEach(() => {
    tool = new MockTool()
  })

  it('formats responses correctly', () => {
    const result = tool.testFormat({ test: 'data' })
    expect(result).to.deep.equal({
      content: [
        {
          type: 'text',
          text: JSON.stringify({ test: 'data' }, null, 2)
        }
      ]
    })
  })

  it('handles errors properly', () => {
    const error = new Error('Test error')
    const result = tool.testError(error)
    expect(result).to.deep.equal({
      content: [
        {
          type: 'text',
          text: `Error: ${error}`
        }
      ],
      isError: true
    })
  })

  it('requires concrete implementations', () => {
    assert.exists(tool.definition);
    assert.exists(tool.execute);
  })
})
