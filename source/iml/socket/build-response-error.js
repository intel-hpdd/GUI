// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

type errorT = Error | string | { [key: string]: string };

export default function buildResponseError(error: errorT): Error {
  if (error instanceof Error)
    return error;
  else if (typeof error === 'string')
    return new Error(error);
  else
    return Object.keys(error).reduce(
      function fillOutProperties(err: Error, key: string) {
        if (key !== 'message')
          // $FlowFixMe: flow does not recogize this monkey-patch
          err[key] = error[key];

        return err;
      },
      new Error(error.message)
    );
}
