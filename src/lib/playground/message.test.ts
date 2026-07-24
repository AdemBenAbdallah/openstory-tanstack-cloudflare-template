import { describe, expect, test } from 'vitest';
import { createPlaygroundResult } from './message';

describe('createPlaygroundResult', () => {
  test('normalizes whitespace and reports message statistics', () => {
    expect(
      createPlaygroundResult(
        '  hello\n  durable   workflows  ',
        '2026-07-24T12:00:00.000Z'
      )
    ).toEqual({
      normalizedMessage: 'hello durable workflows',
      wordCount: 3,
      characterCount: 23,
      receivedAt: '2026-07-24T12:00:00.000Z',
    });
  });
});
