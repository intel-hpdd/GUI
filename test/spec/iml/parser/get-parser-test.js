describe('get parser', function () {
  'use strict';

  beforeEach(module('parserModule'));

  var getParser, getLexer;

  beforeEach(inject(function (_getParser_, _getLexer_) {
    getParser = _getParser_;
    getLexer = _getLexer_;
  }));

  it('should be a function', function () {
    expect(getParser).toEqual(jasmine.any(Function));
  });

  describe('parsing', function () {
    var tokenizer, parser;

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


      function getParseError (token, expected) {
        var name = token && token.name;
        var character = token && token.character;

        return 'Expected ' + expected + ' got ' + name + ' at character ' + character;
      }

      function expect (expected, token) {
        var name = token && token.name;
        return name === expected;
      }

      parser = getParser([
        {
          name: 'value',
          syntax: 'value',
          output: function output (token) {
            return token.content;
          },
          validate: function validate (token) {
            /*
              value can be a left or right hand side of an assignment.

              If left hand side it can be a leading token or following a join.

              If right hand side it can be a final token or following an equals token.
             */


            // join|sof -> value -> equals -> value -> join|eof


            /*
            Is left hand?
              satisfies left hand schema

            Is right hand?
              satisfies right hand schema
            Is neither?
              tell
             */

            var leftHand = (!token.prev || token.prev.name === 'join');

            var rightHand = (!token.next || token.next.name === 'join');


            var nextName = (token.next && token.next.name) || 'nil';
            var prevName = (token.prev && token.prev.name) || 'nil';

            if (leftHand && nextName !== 'equals')
              return 'Left hand value ' + token.content + ' must be followed by equals. Got ' + nextName;
            else if (rightHand && prevName !== 'equals')
              return 'Right hand value ' + token.content + ' must be preceded by equals. Got ' + prevName;
            else if (!leftHand && !rightHand)
              return 'Value ' + token.content + ' must be separated by a join. Got ' + nextName;
          }
        },
        {
          name: 'equals',
          syntax: 'equals',
          output: fp.always('='),
          validate: function validate (token) {
            /*
            value must be a inner token
            value must be surrounded by values
             */

            var nextLens = fp.safe(1, fp.lensProp('next'), {
              name: 'end of string',
              character: token.content.length + token.character
            });

            var msgs = [];

            var next = fp.flowLens(
              nextLens,
              fp.lensProp('name')
            );

            console.log(fp.eq(next(token), 'value'));

            if (token.next.name !== 'value')
              return getParseError(token.next, ['value', 'equals']);
          }
        },
        {
          name: 'join',
          syntax: 'join',
          repeatable: false,
          output: fp.always('&'),
          validate: function validate (token) {
            /*
            join must be a inner token
            join must be surrounded by values
            */

            if (token.next.name !== 'value')
              return getParseError(token.next, 'value');
          }
        }
      ]);
    });

    it('should parse to output', function () {
      expect()
        .toEqual({
          errors: [],
          output: 'type=alert&severity=Warning'
        });
    });

    it('should return an error when parsing fails', function () {
      expect(parser(tokenizer('type = alert and severity')))
        .toEqual({
          errors: [
            'Left hand value severity must be followed by equals. Got nil'
          ],
          output: 'type=alert&'
        });
    });

    it('should handle funky assignments', function () {
      expect(parser(tokenizer('type = alert = severity')))
        .toEqual({
          errors: [
            'value alert must be separated by a join. Got equals'
          ],
          output: 'type=alert&'
        });
    });
  });
});
