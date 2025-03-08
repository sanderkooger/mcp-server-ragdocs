import { sum } from './jestTestFunction.js'

describe('JEST test funcion', () => {
  test('adds 1 + 2 to equal 3 (PASS)', () => {
    expect(sum(1, 2)).toBe(3)
  })
})
