//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
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

import angular from 'angular';


angular
  .module('status')
  .factory('qsToInputParser', function qsToInputParserFactory (getLexer, parsely) {
    'ngInject';

    var tokenizer = getLexer([
      getLexer.whiteSpace,
      {
        name: 'join',
        pattern: /^&/
      },
      {
        name: 'in',
        pattern: /^__in/
      },
      {
        name: 'value',
        pattern: /^[a-zA-Z\d]+(_[a-zA-Z\d]+)?/
      },
      {
        name: 'equals',
        pattern: /^=/
      }
    ]);

    var surround = fp.curry(3, function surround (open, close, str) {
      return open + str + close;
    });

    var parseStr = parsely.parse(fp.always(''));
    var equalsToken = parsely.token('equals');
    var equals = equalsToken(fp.always(' = '));
    var valueToken = parsely.token('value');
    var value = valueToken(fp.lensProp('content'));
    var inToken = parsely.token('in');
    var joinToken = parsely.token('join');

    var assign = parseStr([value, equals, value]);
    var assignSep = parsely.sepBy1(assign, joinToken(fp.always(' and ')));

    var createArray = Array.prototype.slice.bind([]);

    var index1Lens = fp.lensProp('1');

    var inList = parsely.parse(createArray, [
      value,
      inToken(fp.always([])),
      equalsToken(fp.always([])),
      value
    ]);
    var normalizeList = fp.flow(
      inList,
      fp.either(index1Lens.map(fp.arrayWrap)),
      fp.either(fp.arrayWrap)
    );

    var concat = fp.chainL(fp.wrapArgs(fp.flow(
      index1Lens.map(fp.arrayWrap),
      fp.invokeMethod('reverse', []),
      fp.invoke(fp.invokeMethod('concat'))
    )));

    var combineInList = fp.flow(
      parsely.chainL1(normalizeList, joinToken(function op () {
        return function combiner (a, b) {
          var lasta = fp.tail(a);
          var lastb = fp.tail(b);
          var eq = fp.eqFn(fp.head, fp.head, lasta, lastb);

          if (eq)
            fp.tail(lasta).push(fp.tail(lastb));
          else
            a.push(lastb);

          return a;
        };
      })),
      fp.either(
        fp.map(fp.flow(
          index1Lens.map(fp.invokeMethod('join', [', '])),
          index1Lens.map(surround(' in [', ']')),
          concat
        ))
      ),
      fp.either(fp.invokeMethod('join', [' and ']))
    );
    var addAnd = parseStr([
      combineInList,
      fp.flow(parsely.endOfString, fp.unsafe(fp.always(' and ')))
    ]);

    var expr = parsely.manyTill(parsely.choice([addAnd, assignSep]), parsely.endOfString);
    var emptyOrExpr = parsely.optional(expr);
    var statusParser = parseStr([emptyOrExpr, parsely.endOfString]);

    return fp.flow(tokenizer, statusParser);
  });
