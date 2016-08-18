// @flow

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

import highland from 'highland';

import pageVisibility from '../page-visibility.js';

import {
  noop
} from 'intel-fp';


import type {
  HighlandStreamT,
  errorWrapT
} from 'highland';

export const documentHidden = {
  name: 'documentHidden'
};
export const documentVisible = {
  name: 'documentVisible'
};

export function streamWhenVisible ($document:Array<Document>,
                                   documentHidden:typeof documentHidden,
                                   documentVisible:typeof documentVisible):Function {
  'ngInject';

  const doc = $document[0];

  return function streamWhenVisible (streamFn:() => HighlandStreamT<mixed>) {
    var stream;

    const visibleStream:HighlandStreamT<mixed> = highland();

    if (!doc.hidden)
      onShow();

    const removeListener = pageVisibility(function onHide () {
      stream.destroy();
      visibleStream.write(documentHidden);
    }, () => {
      visibleStream.write(documentVisible);
      onShow();
    }, 30000);

    function onShow () {
      stream = streamFn();

      stream
        .consume(consume)
        .each(noop);
    }

    function consume (error:Error, x, push, next) {
      if (visibleStream._nil_pushed)
        return;

      if (error) {
        if (!doc.hidden)
          visibleStream.write(({
            __HighlandStreamError__: true,
            error
          }:errorWrapT));

        next();
      } else if (x === highland.nil) {
        push(null, x);

        if (!doc.hidden)
          visibleStream.write(x);
      } else {
        if (!doc.hidden)
          visibleStream.write(x);

        next();
      }
    }

    const oldDestroy = visibleStream.destroy.bind(visibleStream);
    // $FlowIgnore: flow does not recogize this monkey-patch
    visibleStream.destroy = function destroy () {
      removeListener();
      oldDestroy();
      stream.destroy();
    };

    return visibleStream;
  };
}
