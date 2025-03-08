import { sum } from '../src/utils'
import { describe, expect, test } from '@jest/globals'

describe('JEST Working', () => {
  test('adds 1 + 2 to equal 3 (PASS)', () => {
    expect(sum(1, 2)).toBe(3)
  })
})
