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

angular.module('parserModule')
  .value('manyTill', fp.curry(3, function manyTill (symbolFn, endFn, tokens) {
  var err, rewind;
  var out = '';

  while (true) {
    rewind = getRewinder(tokens);

    var result = symbolFn(tokens);

    if (result instanceof Error) {
      if (out.length)
        rewind(tokens);

      err = result;
      break;
    }

    out += result;

    rewind = getRewinder(tokens);
    result = endFn(tokens);
    rewind(tokens);

    if (!(result instanceof Error))
      break;
  }

  return err || out;
}));

function getRewinder (oldTokens) {
  oldTokens = fp.map(fp.identity, oldTokens);

  return function rewinder (tokens) {
    var tokensDiff = oldTokens.length - tokens.length;
    [].splice.apply(tokens, [0, 0].concat(oldTokens.slice(0, tokensDiff)));
  };
}