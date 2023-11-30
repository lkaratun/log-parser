import { expect } from 'chai';
import fs from 'node:fs/promises';
import { getPartialLineSize, lastNLines } from '../search.js';

const testFileName = 'testLog';

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

  describe('lastNLines', function () {
    afterEach(() => fs.unlink(testFileName));

    async function createTestFile(contents) {
      const testLog = await fs.open(testFileName, 'w');
      testLog.writeFile(contents);
      testLog.close();
    }

    it('Returns last n lines in reverse order when no filter provided', async function () {
      await createTestFile(`Line 1\nLine 2\nLine 3\nLine 4`);
      const actual = await lastNLines(testFileName, 2);
      const expected = ['Line 4', 'Line 3'];
      expect(actual).deep.to.eq(expected);
    });

    it('Returns last n matches when filter is provided', async function () {
      await createTestFile(`Line 1\nXXX1\nLine 3\nLine 4\nXXX2\nLine 4\nXXX3`);
      const actual = await lastNLines(testFileName, 2, 'XXX');
      const expected = ['XXX3', 'XXX2'];
      expect(actual).deep.to.eq(expected);
    });

    it('Works correctly with special characters', async function () {
      await createTestFile(`œ∑πππ\nœœœ1\nøøøø\n††††††\n®®®\nLine œœœ2\n∑∑∑`);
      const actual = await lastNLines(testFileName, 2, 'œ');
      const expected = ['Line œœœ2', 'œœœ1'];
      expect(actual).deep.to.eq(expected);
    });

    it('Returns empty array when no matches found', async function () {
      await createTestFile(`Line 1\nXXX1\nLine 3\nLine 4\nXXX2\nLine 4\nXXX3`);
      const actual = await lastNLines(testFileName, 2, 'does not exist in file');
      const expected = [];
      expect(actual).deep.to.eq(expected);
    });
  });
});
