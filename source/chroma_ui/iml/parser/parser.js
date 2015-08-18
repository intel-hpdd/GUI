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

angular.module('parserModule')
  .factory('getParser',
  [function getParserFactory () {
    'use strict';

    var findError = fp.find(function findError (token) {
      return token instanceof Error;
    });

    return fp.curry(2, function getParser (rules, tokens) {
      return buildOutput(tokens, rules, {
        errors: [],
        output: ''
      });
    });

    function buildOutput (tokens, rules, out) {
      if (!tokens.length)
        return out;

      var foundMatch = rules.some(function findRule (rule) {
        var consumed = rule.pattern(tokens);

        if (consumed.length) {
          var err = rule.validate(consumed);

          if (err)
            out.errors.push(err.message);
          else
            out.output += rule.output(tokens);

          tokens = tokens.slice(consumed.length);

          return true;
        }
      });

      if (!foundMatch)
        throw new Error('no match found!!');

      return buildOutput(tokens, rules, out);
    }

    return function getParser2 (rules) {
      function buildOutput (tokens, rules) {
        return tokens.reduce(function reducer (out, token) {
          rules.forEach(function findRule (rule) {
            if (token.name !== rule.name)
              return;

            var err = rule
              .validate(token);

            if (err)
              out.errors.push(err);
            else
              out.output += rule.output(token);
          });

          return out;
        }, {
          errors: [],
          output: ''
        });
      }

      return function parser (tokens) {
        return buildOutput(tokens, rules);
      };
    };
  }]);
