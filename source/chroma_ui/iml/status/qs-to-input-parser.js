//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2015 Intel Corporation All Rights Reserved.
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
  .factory('qsToInputParser', function qsToInputParserFactory (getLexer, parsely) {
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
        pattern: /^[a-zA-Z\d]+/
      },
      {
        name: 'equals',
        pattern: /^=/
      },
      {
        name: 'sep',
        pattern: /^,/
      }
    ]);

    var surround = fp.curry(3, function surround (open, close, str) {
      return open + str + close;
    });

    var value = parsely.token('value', fp.lensProp('content'));
    var equals = parsely.token('equals', fp.always(' = '));
    var join = parsely.token('join', fp.always(' and '));
    var sep = parsely.token('sep', fp.always(','));
    var inToken = parsely.token('in', fp.always(' in '));
    var valueSep = fp.flow(parsely.sepBy1(value, sep), fp.either(surround('[', ']')));
    var dropEquals = fp.flow(equals, fp.either(fp.always('')));
    var inList = parsely.parse([value, inToken, dropEquals, valueSep]);
    var assign = parsely.parse([value, equals, value]);
    var assignOrIn = parsely.choice([assign, inList]);
    var expr = parsely.sepBy1(assignOrIn, join);
    var emptyOrExpr = parsely.optional(expr);
    var statusParser = parsely.parse([emptyOrExpr, parsely.endOfString]);

    return fp.flow(tokenizer, statusParser);
  });
