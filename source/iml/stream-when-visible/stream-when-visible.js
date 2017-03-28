// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from 'highland';
import * as fp from 'intel-fp';
import pageVisibility from '../page-visibility.js';

import type { HighlandStreamT, errorWrapT } from 'highland';

export const documentHidden = {
  name: 'documentHidden'
};
export const documentVisible = {
  name: 'documentVisible'
};

export function streamWhenVisible(
  $document: Array<Document>,
  documentHidden: typeof documentHidden,
  documentVisible: typeof documentVisible
): Function {
  'ngInject';
  const doc = $document[0];

  return function streamWhenVisible(streamFn: () => HighlandStreamT<mixed>) {
    let stream;

    const visibleStream: HighlandStreamT<mixed> = highland();

    if (!doc.hidden) onShow();

    const removeListener = pageVisibility(
      function onHide() {
        stream.destroy();
        visibleStream.write(documentHidden);
      },
      () => {
        visibleStream.write(documentVisible);
        onShow();
      },
      30000
    );

    function onShow() {
      stream = streamFn();

      stream.consume(consume).each(fp.noop);
    }

    function consume(error: Error, x, push, next) {
      if (visibleStream._nil_pushed) return;

      if (error) {
        if (!doc.hidden)
          visibleStream.write(
            ({
              __HighlandStreamError__: true,
              error
            }: errorWrapT)
          );

        next();
      } else if (x === highland.nil) {
        push(null, x);

        if (!doc.hidden) visibleStream.write(x);
      } else {
        if (!doc.hidden) visibleStream.write(x);

        next();
      }
    }

    const oldDestroy = visibleStream.destroy.bind(visibleStream);
    // $FlowFixMe: flow does not recogize this monkey-patch
    visibleStream.destroy = function destroy() {
      removeListener();
      oldDestroy();
      stream.destroy();
    };

    return visibleStream;
  };
}
