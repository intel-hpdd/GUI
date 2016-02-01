import parserModule from '../../../../source/iml/parser/parser-module';
import {__, always} from 'intel-fp';

describe('parser parse', function () {
  'use strict';

  beforeEach(module(parserModule));

  var parse;

  beforeEach(inject(function (_parse_) {
    parse = _parse_;
  }));

  it('should be a function', function () {
    expect(parse).toEqual(jasmine.any(Function));
  });

  it('should be curried', function () {
    expect(parse(__, __)).toEqual(jasmine.any(Function));
  });

  it('should reduce to an output string', function () {
    var out = parse(always(''),
      [
        always('a'),
        always('b'),
        always('c')
      ],
      []
    );

    expect(out).toBe('abc');
  });

  it('should return the first error found', function () {
    var out = parse(always(''), [
      always('a'),
      always(new Error('boom!'))
    ], []);

    expect(out.message).toBe('boom!');
  });

  it('should parse arrays', function () {
    var out = parse(Array.prototype.slice.bind([]),
      [
        always('a'),
        always('b'),
        always('c')
      ],
      []
    );

    expect(out).toEqual([
      'a',
      'b',
      'c'
    ]);
  });
});
