describe('The lexer', function () {
  'use strict';

  beforeEach(window.module('parserModule'));

  var getLexer;

  beforeEach(inject(function (_getLexer_) {
    getLexer = _getLexer_;
  }));

  it('should be a function', function () {
    expect(getLexer).toEqual(jasmine.any(Function));
  });

  it('should return a tokenize function', function () {
    expect(getLexer([])).toEqual(jasmine.any(Function));
  });

  describe('tokenizing', function () {
    var tokenizer;

    beforeEach(function () {
      tokenizer = getLexer([
        {
          name: 'whiteSpace',
          pattern: /^[ \t\n]+/,
          ignore: true
        },
        { name: 'join', pattern: /^and/ },
        { name: 'value', pattern: /^[a-zA-z]+/ },
        { name: 'equals', pattern: /^=/}
      ]);
    });

    it('should return a tokenizer', function () {
      expect(tokenizer).toEqual(jasmine.any(Function));
    });

    it('should return an empty array if passed a null like value', function () {
      expect(tokenizer()).toEqual([]);
    });

    it('should return an empty array for an empty string', function () {
      expect(tokenizer('')).toEqual([]);
    });

    it('should tokenize a simple expression', function () {
      expect(tokenizer('type = alert and severity = Warning'))
        .toEqual([
          { content: 'type', name: 'value', character: 0, next: jasmine.any(Object) },
          { content: '=', name: 'equals', character: 5, prev: jasmine.any(Object), next: jasmine.any(Object) },
          { content: 'alert', name: 'value', character: 7, prev: jasmine.any(Object), next: jasmine.any(Object) },
          { content: 'and', name: 'join', character: 13, prev: jasmine.any(Object), next: jasmine.any(Object) },
          { content: 'severity', name: 'value', character: 17, prev: jasmine.any(Object), next: jasmine.any(Object) },
          { content: '=', name: 'equals', character: 26, prev: jasmine.any(Object), next: jasmine.any(Object) },
          { content: 'Warning', name: 'value', character: 28, prev: jasmine.any(Object) }
        ]);
    });

    it('should tokenize errors', function () {
      expect(tokenizer('type = 23 and'))
        .toEqual([
          { content: 'type', name: 'value', character: 0, next: jasmine.any(Object) },
          { content: '=', name: 'equals', character: 5, prev: jasmine.any(Object), next: jasmine.any(Object)},
          { content: '23', name: 'error', character: 7, prev: jasmine.any(Object), next: jasmine.any(Object) },
          { content: 'and', name: 'join', character: 10, prev: jasmine.any(Object)}
        ]);
    });

    it('should handle a string ending in errors', function () {
      expect(tokenizer('type = 23'))
        .toEqual([
          { content: 'type', name: 'value', character: 0, next: jasmine.any(Object) },
          { content: '=', name: 'equals', character: 5, prev: jasmine.any(Object), next: jasmine.any(Object)},
          { content: '23', name: 'error', character: 7, prev: jasmine.any(Object) }
        ]);
    });

    it('should handle a string starting in errors', function () {
      expect(tokenizer('23 = foo'))
        .toEqual([
          { content: '23', name: 'error', character: 0, next: jasmine.any(Object) },
          { content: '=', name: 'equals', character: 3, prev: jasmine.any(Object), next: jasmine.any(Object)},
          { content: 'foo', name: 'value', character: 5, prev: jasmine.any(Object) }
        ]);
    });

    it('should handle an error string', function () {
      expect(tokenizer('23'))
        .toEqual([
          { content: '23', name: 'error', character: 0 }
        ]);
    });

    it('should handle a string with multiple errors', function () {
      expect(tokenizer('23 = 24'))
        .toEqual([
          { content: '23', name: 'error', character: 0, next: jasmine.any(Object) },
          { content: '=', name: 'equals', character: 3, prev: jasmine.any(Object), next: jasmine.any(Object)},
          { content: '24', name: 'error', character: 5, prev: jasmine.any(Object) }
        ]);
    });

    describe('linked list', function () {
      var tokens;

      beforeEach(function () {
        tokens = tokenizer('type = alert');
      });

      it('should have a previous pointer', function () {
        expect(tokens[1].prev).toEqual({
          content: 'type',
          name: 'value',
          character: 0,
          next: jasmine.any(Object)
        });
      });

      it('should have a next pointer', function () {
        expect(tokens[1].next).toEqual({
          content: 'alert',
          name: 'value',
          character: 7,
          prev: jasmine.any(Object)
        });
      });

      it('should not have a prev for the first token', function () {
        expect(tokens[0].prev).toBeUndefined();
      });

      it('should not have a next for the last token', function () {
        expect(tokens[2].next).toBeUndefined();
      });
    });
  });
});
