import { expect } from 'chai';
import { sum } from './testFunction.js';

describe('sum function', () => {
  it('should add two numbers correctly', () => {
    // Arrange
    const a = 1;
    const b = 2;
    
    // Act
    const result = sum(a, b);
    
    // Assert
    expect(result).to.equal(3);
  });
});
