import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

import { ListQueueTool } from './list-queue.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const QUEUE_FILE = path.join(__dirname, '..', '..', 'queue.txt');

describe('ListQueueTool', () => {
  let tool: ListQueueTool;
  let fsStub: sinon.SinonStubbedInstance<typeof fs>;

  beforeEach(() => {
    tool = new ListQueueTool();
    fsStub = sinon.stub(fs);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('execute', () => {
    it('should return empty message for missing queue file', async () => {
      // Arrange
      fsStub.access.rejects(Object.assign(new Error('File not found'), { code: 'ENOENT' }));

      // Act
      const result = await tool.execute({});

      // Assert
      expect(result.content[0]!.text).to.equal(
        'Queue is empty (queue file does not exist)'
      );
    });

    it('should list queued URLs in insertion order', async () => {
      // Arrange
      const testUrls = [
        'https://example.com/1',
        'https://example.com/2',
        'https://example.com/3'
      ].join('\n');
      
      fsStub.access.resolves();
      fsStub.readFile.resolves(testUrls);

      // Act
      const result = await tool.execute({});

      // Assert
      expect(result.content[0]!.text).to.equal(
        `Queue contains 3 URLs:\n${testUrls}`
      );
    });

    it('should handle filesystem errors', async () => {
      // Arrange
      const testError = Object.assign(new Error('Permission denied'), { code: 'EACCES' });
      fsStub.access.resolves();
      fsStub.readFile.rejects(testError);

      // Act
      const result = await tool.execute({});

      // Assert
      expect(result.isError).to.equal(true);
      expect(result.content[0]!.text).to.include(
        `Failed to read queue: ${testError}`
      );
    });

    it('should validate tool definition', () => {
      // Act
      const definition = tool.definition;

      // Assert
      expect(definition.name).to.equal('list_queue');
      expect(definition.description).to.include('processing queue');
      expect(definition.inputSchema).to.deep.equal({
        type: 'object',
        properties: {},
        required: []
      });
    });

    it('should format empty file as empty queue', async () => {
      // Arrange
      fsStub.access.resolves();
      fsStub.readFile.resolves('');

      // Act
      const result = await tool.execute({});

      // Assert
      expect(result.content[0]!.text).to.equal('Queue is empty');
    });

    it('should handle mixed newline formats', async () => {
      // Arrange
      const testUrls = 'https://example.com/1\r\nhttps://example.com/2\nhttps://example.com/3';
      fsStub.access.resolves();
      fsStub.readFile.resolves(testUrls);

      // Act
      const result = await tool.execute({});

      // Assert
      expect(result.content[0]!.text.replace(/\r/g, '')).to.equal(
        'Queue contains 3 URLs:\nhttps://example.com/1\nhttps://example.com/2\nhttps://example.com/3'
      );
    });
  });
});