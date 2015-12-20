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

export function streamWhenVisible ($document, λ, pageVisibility) {
  'ngInject';

  const document = $document[0];

  return function streamWhenVisible (streamFn) {
    var stream;

    const visibleStream = λ();

    if (!document.hidden)
      onShow();

    const removeListener = pageVisibility(function onHide () {
      stream.destroy();
      visibleStream.write([]);
    }, onShow);

    function onShow () {
      stream = streamFn();

      stream
        .consume(consume)
        .each(fp.noop);
    }

    function consume (error, x, push, next) {
      if (error) {
        if (!document.hidden)
          visibleStream.write({
            __HighlandStreamError__: true,
            error
          });

        next();
      } else if (x === λ.nil) {
        push(null, x);

        if (!document.hidden)
          visibleStream.write(x);
      } else {
        if (!document.hidden)
          visibleStream.write(x);

        next();
      }
    }

    const oldDestroy = visibleStream.destroy.bind(visibleStream);
    visibleStream.destroy = function destroy () {
      removeListener();
      oldDestroy();
      stream.destroy();
    };

    return visibleStream;
  };
}
