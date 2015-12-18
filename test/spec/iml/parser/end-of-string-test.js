describe('parser end of string', function () {
  'use strict';

  beforeEach(window.module('parserModule'));

  var endOfString;

  beforeEach(inject(function (_endOfString_) {
    endOfString = _endOfString_;
  }));

  it('should be a function', function () {
    expect(endOfString).toEqual(jasmine.any(Function));
  });

  it('should return an empty string if there are no tokens', function () {
    expect(endOfString([])).toEqual('');
  });

  it('should return an error if there are tokens left', function () {
    expect(endOfString([{
      name: 'foo'
    }]).message).toBe('Expected end of string got foo');
  });
});
