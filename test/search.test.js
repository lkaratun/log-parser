import { expect } from 'chai';
import { getPartialLineSize } from '../search.js';

describe('search', function () {
  describe('getPartialLineSize', function () {
    it('Works correctly for regular characters', function () {
      const actual = getPartialLineSize('123 abc\nline 2\n');
      const expected = 8;
      expect(actual).to.eq(expected);
    });
    it('Works correctly when first char is line break', function () {
      const actual = getPartialLineSize('\nline 2\n');
      const expected = 1;
      expect(actual).to.eq(expected);
    });
    it('Works correctly for special characters', function () {
      const actual = getPartialLineSize('»\nline 2\n');
      const expected = 3;
      expect(actual).to.eq(expected);
    });
  });
});
