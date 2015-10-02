describe('parser parsely', function () {
  'use strict';

  beforeEach(module('parserModule', function ($provide) {
    $provide.value('token', 'token');
    $provide.value('parse', 'parse');
    $provide.value('sepBy1', 'sepBy1');
    $provide.value('manyTill', 'manyTill');
    $provide.value('choice', 'choice');
    $provide.value('optional', 'optional');
    $provide.value('chainL1', 'chainL1');
    $provide.value('endOfString', 'endOfString');
  }));

  var parsely;

  beforeEach(inject(function (_parsely_) {
    parsely = _parsely_;
  }));

  it('should return an object', function () {
    expect(parsely).toEqual({
      parse: 'parse',
      token: 'token',
      sepBy1: 'sepBy1',
      manyTill: 'manyTill',
      chainL1: 'chainL1',
      choice: 'choice',
      optional: 'optional',
      endOfString: 'endOfString'
    });
  });
});
