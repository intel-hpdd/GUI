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
  .module('status')
  .factory('inputToQsParser', function statusParserFactory (getLexer, parsely) {
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
        pattern: /^[a-zA-Z_\d]+/
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

    var parseToStr = parsely.parse(fp.always(''));
    var value = parsely.token('value', fp.lensProp('content'));
    var equals = parsely.token('equals', fp.always('='));
    var inToken = parsely.token('in', fp.always('__in='));
    var startList = parsely.token('startList', fp.always('['));
    var endList = parsely.token('endList', fp.always(']'));
    var sep = parsely.token('sep', fp.always(','));
    var join = parsely.token('join', fp.always('&'));
    var valueSep = parsely.sepBy1(value, sep);
    var assign = parseToStr([value, equals, value]);
    var list = parseToStr([startList, valueSep, endList]);
    var inList = fp.flow(parseToStr([value, inToken, list]), fp.either(function (output) {
      var parts = output.split('=');
      var ins = parts[1]
        .replace(/\[(.+)]/, '$1')
        .split(',');

      return ins.map(function (x) {
        return parts[0] + '=' + x;
      }).join('&');
    }));
    var assignOrIn = parsely.choice([assign, inList]);
    var expr = parsely.sepBy1(assignOrIn, join);
    var emptyOrExpr = parsely.optional(expr);
    var statusParser = parseToStr([emptyOrExpr, parsely.endOfString]);

    return fp.flow(tokenizer, statusParser);
  });
