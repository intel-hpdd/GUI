//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2014 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

angular
  .module('statusModule')
  .factory('statusParser', ['getLexer', 'getParser', function statusParserFactory (getLexer, getParser) {
    'use strict';

    var tokenizer = getLexer([
      getLexer.whiteSpace,
      {
        name: 'join',
        pattern: /^and/
      },
      {
        name: 'in',
        pattern: /^in/
      },
      {
        name: 'value',
        pattern: /^[a-zA-Z\d]+/
      },
      {
        name: 'equals',
        pattern: /^=/
      },
      {
        name: 'startList',
        pattern: /^\[/
      },
      {
        name: 'endList',
        pattern: /^]/
      },
      {
        name: 'sep',
        pattern: /^,/
      }
    ]);

    function getParseError (token, expected) {
      return 'Expected ' + expected + ' got ' + token.name + ' at character ' + token.character;
    }

    var nextLens = fp.lensProp('next');
    var getNext = fp.cond(
      [nextLens, nextLens],
      [fp.true, function getEosToken (token) {
        return {
          name: 'end of string',
          content: '',
          character: token.character + token.content.length
        };
      }]
    );

    var nameLens = fp.lensProp('name');
    var getNextName = fp.flowLens(
      getNext,
      nameLens
    );

    var findError = fp.find(function findError (token) {
      return token instanceof Error;
    });

    function head (list) {
      return list[0];
    }

    var matchName = fp.curry(2, function matchName (name, token) {
      var tokenName = nameLens(token);

      if (fp.eq(tokenName, name))
        return [token];

      return [];

      //else
      //  return [new Error('Expected ' + name + ' got ' + token.name + ' at character ' + token.character)];
    });

    var prevLens = fp.lensProp('prev');
    var getPrev = fp.cond(
      [prevLens, prevLens],
      [fp.true, fp.always({
        name: 'start of string',
        content: '',
        character: 0
      })]);

    var getPrevName = fp.flowLens(
      getPrev,
      nameLens
    );

    var matchPrev = fp.curry(2, function matchPrev (name, token) {
      if (token instanceof Error)
        return token;

      var prev = getPrev(token);

      if (fp.not(fp.eq(nameLens(prev), name)))
        return new Error('Expected ' + name + ' got ' + nameLens(prev) + ' at character ' + prev.character);

      return token;
    });

    var matchNext = fp.curry(2, function matchNext (name, token) {
      if (token instanceof Error)
        return token;

      var next = getNext(token);

      if (fp.not(fp.eq(nameLens(next), name)))
        return new Error('Expected ' + name + ' got ' + nameLens(next) + ' at character ' + next.character);

      return token;
    });

    var parser = getParser([
      //{
      //  name: 'error',
      //  validate: function formMessage (token) {
      //    return 'Invalid token ' + token.content + ' at character ' + token.character;
      //  }
      //},
      {
        name: 'in',
        pattern: fp.flow(head, matchName('in')),
        output: fp.always(''),
        validate: fp.flow(head, matchPrev('value'), matchNext('startList'))
      },
      //{
      //  name: 'list',
      //  pattern: function pattern (tokens) {
      //    var nameSep = sepBy(matchName('value'), matchName('sep'));
      //
      //    var matchOpen = matchName('startList');
      //    var matchClose = matchName('endList');
      //
      //    function stopOnError () {
      //      var fns = [].slice.call(arguments);
      //
      //      return function run (tokens) {
      //        var out = [];
      //
      //        fns.some(function isError (fn) {
      //          if (!tokens.length)
      //            return true;
      //
      //          var result = fn(tokens);
      //          var err = findError(result);
      //
      //          if (!err) {
      //            out = out.concat(result);
      //            tokens = tokens.slice(result.length);
      //          }
      //
      //          return err;
      //        });
      //
      //        return out;
      //      };
      //    }
      //
      //    return stopOnError(matchOpen, nameSep, matchClose)(tokens);
      //
      //    function sepBy (content, sep) {
      //      return function x (tokens) {
      //        var result = content(tokens);
      //        var err = findError(result);
      //
      //        if (err || result.length === 0)
      //          return [];
      //
      //        var sepResult = sep(tokens.slice(result.length));
      //        err = findError(sepResult);
      //
      //        if (!err)
      //          result = result.concat(sepResult);
      //
      //        return result.concat(x(tokens.slice(result.length)));
      //      };
      //    }
      //  },
      //  output: function output (tokens) {
      //  },
      //  validate: function validate (tokens) {
      //    var err = findError(tokens);
      //
      //    if (err)
      //      return err.message;
      //  }
      //},
      {
        name: 'value',
        output: fp.lensProp('content'),
        pattern: fp.flow(head, matchName('value')),
        validate: fp.flow(head, function validate (token) {
          var prevEq = fp.eqFn(fp.identity, getPrevName);
          var nextEq = fp.eqFn(fp.identity, getNextName);
          var leftHand = fp.or(prevEq('start of string'), prevEq('join'));
          var rightHand = fp.or(nextEq('end of string'), nextEq('join'));

          function oneOf (choices) {
            choices = fp.map(fp.curry(1, fp.eqFn(fp.identity, nameLens)), choices);
            return fp.or.apply(null, choices);
          }

          var oneOfOrError = fp.curry(2, function oneOfOrError(choices, token) {
            var matches = oneOf(choices);

            if (!matches(token))
              return buildError(choices, token);
          });

          function buildError (expectedName, token) {
            if (Array.isArray(expectedName))
              return new Error('Expected one of ' + expectedName.join(', ') + ' got ' + nameLens(token) + ' at character ' + token.character);
            else
              return new Error('Expected ' + expectedName + ' got ' + nameLens(token) + ' at character ' + token.character);
          }

          var equalsOrIn = oneOfOrError(['equals', 'in']);

          return fp.cond(
            [leftHand, fp.flow(getNext, equalsOrIn)],
            [rightHand, fp.flow(getPrev, equalsOrIn)],
            [fp.flow(fp.and(leftHand, rightHand), fp.not), fp.flow(getNext, oneOfOrError(['join']))]
          )(token);

          //var prevName = getPrevName(token);
          //var nextName = getNextName(token);
          //
          //var leftHand = prevName === 'start of string' || prevName === 'join';
          //var rightHand = nextName === 'end of string' || nextName === 'join';
          //
          //if (leftHand && nextName !== 'equals')
          //  return 'Left hand value ' + token.content + ' must be followed by equals. Got ' + nextName;
          //else if (rightHand && prevName !== 'equals')
          //  return 'Right hand value ' + token.content + ' must be preceded by equals. Got ' + prevName;
          //else if (!leftHand && !rightHand)
          //  return 'Value ' + token.content + ' must be separated by a join. Got ' + nextName;
        })
      },
      {
        name: 'equals',
        pattern: fp.flow(head, matchName('equals')),
        output: fp.always('='),
        validate: fp.flow(head, matchPrev('value'), matchNext('value'))
      }
      //{
      //  name: 'join',
      //  output: fp.always('&'),
      //  validate: function validate (token) {
      //    if (fp.not(fp.eq(getPrevName(token), 'value')))
      //      return getParseError(getPrev(token), 'value');
      //
      //    if (fp.not(fp.eq(getNextName(token), 'value')))
      //      return getParseError(getNext(token), 'value');
      //  }
      //}
    ]);

    return fp.flow(tokenizer, parser);
  }])
  .controller('StatusParserController', ['statusParser', function StatusParserController (statusParser) {
    'use strict';

    var ctrl = this;

    this.submit = function submit () {
      ctrl.onSubmit(statusParser(ctrl.query));
    };

    this.parse = statusParser;
  }])
  .directive('statusParser', [function statusParser () {
    'use strict';

    return {
      restrict: 'E',
      require: 'ngModel',
      bindToController: true,
      controllerAs: 'ctrl',
      scope: {
        onSubmit: '&'
      },
      templateUrl: 'iml/status/assets/html/status-parser.html',
      controller: 'StatusParserController'
    };
  }])
  .directive('validateStatusQuery', ['statusParser', function validateStatusQuery (statusParser) {
    'use strict';

    return {
      require: 'ngModel',
      link: function link (scope, element, attrs, ctrl) {
        ctrl.$validators.query = function query (modelValue, viewValue) {
          var result = statusParser(viewValue);

          return result.errors.length === 0;
        };
      }
    };
  }]);
