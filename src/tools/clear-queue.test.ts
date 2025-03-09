import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

import { ClearQueueTool } from './clear-queue.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const QUEUE_FILE = path.join(__dirname, '..', '..', 'queue.txt');

describe('ClearQueueTool', () => {
  let tool: ClearQueueTool;
  let fsStub: sinon.SinonStubbedInstance<typeof fs>;

  beforeEach(() => {
    tool = new ClearQueueTool();
    fsStub = sinon.stub(fs);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('execute', () => {
    it('should clear non-empty queue and return success message', async () => {
      // Arrange
      const testUrls = ['https://example.com/1', 'https://example.com/2'];
      fsStub.access.resolves();
      fsStub.readFile.resolves(testUrls.join('\n'));
      fsStub.writeFile.resolves();

      // Act
      const result = await tool.execute({});

      // Assert
      expect(fsStub.writeFile.calledWith(QUEUE_FILE, '')).to.equal(true);
      expect(result.content[0]!.text).to.equal(
        'Queue cleared successfully. Removed 2 URLs from the queue.'
      );
    });

    it('should handle empty queue file scenario', async () => {
      // Arrange
      fsStub.access.rejects(new Error('File not found'));

      // Act
      const result = await tool.execute({});

      // Assert
      expect(result.content[0]!.text).to.equal(
        'Queue is already empty (queue file does not exist)'
      );
    });

    it('should report singular URL count correctly', async () => {
      // Arrange
      fsStub.access.resolves();
      fsStub.readFile.resolves('https://example.com/1\n');
      fsStub.writeFile.resolves();

      // Act
      const result = await tool.execute({});

      // Assert
      expect(result.content[0]!.text).to.include('1 URL');
    });

    it('should handle filesystem errors during clearance', async () => {
      // Arrange
      const testError = new Error('Permission denied');
      fsStub.access.resolves();
      fsStub.readFile.rejects(testError);

      // Act
      const result = await tool.execute({});

      // Assert
      expect(result.isError).to.equal(true);
      expect(result.content[0]!.text).to.include(
        `Failed to clear queue: ${testError}`
      );
    });
  });
});