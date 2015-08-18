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


(function () {
  'use strict';

  angular
    .module('highland', [])
    .value('λ', window.highland)
    .factory('addProperty', ['λ', function addPropertyFactory (λ) {
      /**
       * Given a stream, adds a property to it to memorize
       * the last value that passes through.
       * @param {Highland.Stream} s
       * @returns {Highland.Stream}
       */
      return function addProperty (s) {
        var latest;

        var s2 = s.consume(function setLatest (err, x, push, next) {
          if (err)
            return push(err);

          if (x === nil)
            return push(null, nil);

          latest = x;

          push(null, x);

          next();
        });

        s2.property = function property () {
          var s = λ();
          s.id = 'fork:' + s.id;
          s.source = this;
          if (latest)
            s.write(latest);
          this._consumers.push(s);
          this._checkBackPressure();

          var oldDestroy = s.destroy;

          s.destroy = function destroy () {
            if (s._nil_seen)
              return;

            oldDestroy.call(s);
          };

          return s;
        };

        s2.destroy = s.destroy.bind(s);

        return s2;
      };
    }]);
}());
