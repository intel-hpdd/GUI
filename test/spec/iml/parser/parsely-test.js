describe('parser parsely', function () {
  'use strict';

  beforeEach(module('parserModule', function ($provide) {
    $provide.value('token', 'token');
    $provide.value('parse', 'parse');
    $provide.value('sepBy1', 'sepBy1');
    $provide.value('choice', 'choice');
    $provide.value('optional', 'optional');
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
      choice: 'choice',
      optional: 'optional'
    });
  });
});
