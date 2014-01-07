"use strict";

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
  });
});