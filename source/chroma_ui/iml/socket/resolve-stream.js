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

angular.module('socket-module')
  .factory('resolveStream', ['$q', function resolveStreamFactory ($q) {
    'use strict';

    /**
     * Given a stream, returns a promise that does not
     * resolve until the stream contains a token.
     * @param {Highland.Stream} stream
     * @returns {ng.IQService}
     */
    return function resolveStream (stream) {
      var deferred = $q.defer();

      stream.pull(function resolvePromise (err, x) {
        if (err) {
          x = {
            __HighlandStreamError__: true,
            error: err
          };
        }

        var s2 = stream.tap(_.noop);
        s2.write(x);

        s2.destroy = stream.destroy.bind(stream);

        deferred.resolve(s2);
      });

      return deferred.promise;
    };
  }]);
