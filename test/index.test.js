'use strict';

var assert = require('assert');
var udiff = require('../src/index');

describe('udiff Tests', function () {
  describe('parseFromFile', function () {
    it('returns a JS object representing the udiff', function (done) {
      udiff.parseFromFile('./test/sample.diff', function (err, diffs) {
        assert.ifError(err);

        assert.ok(diffs['index.js']);
        assert.equal(diffs['index.js'].hunks.length, 1);
        assert.deepEqual(diffs['index.js'].hunks[0].old, {
          from: 1,
          numLines: 8
        });
        assert.deepEqual(diffs['index.js'].hunks[0].new, {
          from: 1,
          numLines: 12
        });
        assert.equal(diffs['index.js'].hunks[0].lines.length, 16);

        done();
      });
    });

    it('returns a JS object representing the udiff when the file only has one line and is a newly created', function (done) {
      udiff.parseFromFile('./test/singleline.diff', function (err, diffs) {
        assert.ifError(err);

        assert.ok(diffs['new.md']);
        assert.equal(diffs['new.md'].hunks.length, 1);
        assert.deepEqual(diffs['new.md'].hunks[0].old, {
          from: 0,
          numLines: 0
        });
        assert.deepEqual(diffs['new.md'].hunks[0].new, {
          from: 1,
          numLines: 1
        });
        assert.equal(diffs['new.md'].hunks[0].lines.length, 1);

        done();
      });
    });
  });
});