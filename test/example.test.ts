import { sum } from '../src/utils'
import { describe, expect, test } from '@jest/globals'

describe('sum module', () => {
  test('adds 1 + 2 to equal 3 (PASS)', () => {
    expect(sum(1, 2)).toBe(3)
  })

  test('adds 1 + 1 to equal 3 (FAIL)', () => {
    expect(sum(1, 1)).toBe(3)
  })
})
