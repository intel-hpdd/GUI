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

import {curry, map, identity} from 'intel-fp/fp';

angular.module('parserModule')
  .value('chainL1', curry(3, function chainL1 (parse, operation, tokens) {
    var out, err, rewind;

    var fn = identity;

    while (true) {
      rewind = getRewinder(tokens);

      var result = parse(tokens);

      if (isError(result)) {
        if (out)
          rewind(tokens);

        err = result;
        break;
      }

      out = fn(result);

      rewind = getRewinder(tokens);

      fn = operation(tokens);

      if (isError(fn)) {
        rewind(tokens);
        break;
      }

      throwIfBadType(fn);

      fn = curry(2, fn)(out);
    }

    return out ? out : err;
  }));

function throwIfBadType (x) {
  if (typeof x !== 'function')
    throw new Error('operation result must be an Error or a Function, got: ' + typeof x);
}

function isError (x) {
  return x instanceof Error;
}

function getRewinder (oldTokens) {
  oldTokens = map(identity, oldTokens);

  return function rewinder (tokens) {
    var tokensDiff = oldTokens.length - tokens.length;
    [].splice.apply(tokens, [0, 0].concat(oldTokens.slice(0, tokensDiff)));
  };
}

