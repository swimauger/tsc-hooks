const fs = require('fs');
const path = require('path');

const root = fs.readdirSync(path.resolve(__dirname, 'test/dist'));
const markup = fs.readdirSync(path.resolve(__dirname, 'test/dist/markup'));

describe('copy-files hook tests', () => {
  test('Ensure all expected files from the root are there', () => {
    expect(root).toEqual(
      expect.arrayContaining([
        'test.ts',
        'test.js',
        'test.json'
      ])
    );
  });

  test('Ensure NOT expected files from the root aren\'t there', () => {
    expect(root).not.toEqual(
      expect.arrayContaining([
        'test.txt'
      ])
    );
  });

  test('Ensure all expected files from the markup folder are there', () => {
    expect(markup).toEqual(
      expect.arrayContaining([
        'test.html',
        'test.xml'
      ])
    );
  });

  test('Ensure NOT expected files from the markup folder aren\'t there', () => {
    expect(markup).not.toEqual(
      expect.arrayContaining([
        'test.md'
      ])
    );
  });
});