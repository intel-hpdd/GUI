import angular from 'angular';
const {module, inject} = angular.mock;

describe('chain left 1', function () {
  beforeEach(module('parserModule'));

  var chainL1, ifToken;

  beforeEach(inject(function (_chainL1_) {
    chainL1 = _chainL1_;

    ifToken = fp.curry(2, function ifToken (fn, t) {
      if (!t.length)
        return new Error('boom!');

      var result = t.shift();

      return fn(result);
    });
  }));

  it('should return a function', function () {
    expect(chainL1).toEqual(jasmine.any(Function));
  });

  it('should be curried', function () {
    expect(chainL1(fp.__, fp.__)).toEqual(jasmine.any(Function));
  });

  it('should work for addition and subtraction', function () {
    var adder = chainL1(ifToken(fp.identity), function addOrSubtract (t) {
      var op = t.shift();

      if (op === '+')
        return function add (a, b) {
          return a + b;
        };

      if (op === '-')
        return function subtract (a, b) {
          return a - b;
        };

      return new Error('operation not recognized.');
    });

    expect(adder([
      1,
      '+',
      2,
      '+',
      3,
      '-',
      2
    ])).toBe(4);
  });

  it('should error if op does not return a function', function () {
    function shouldThrow () {
      chainL1(ifToken(fp.identity), fp.always(true), [1, 2, 3]);
    }

    expect(shouldThrow).toThrow(new Error('operation result must be an Error or a Function, got: boolean'));
  });

  it('should not consume when input was taken', function () {
    var t = [
      1,
      2,
      3
    ];

    chainL1(fp.flow(ifToken(fp.identity), ifToken(fp.always(new Error('boom!')))), fp.always(fp.identity), t);

    expect(t).toEqual([2,3]);
  });

  it('should consume when no input was taken', function () {
    var t = [
      1,
      2,
      3
    ];

    chainL1(ifToken(fp.always(new Error('boom!'))), fp.always(fp.identity), t);

    expect(t).toEqual([2,3]);
  });
});
