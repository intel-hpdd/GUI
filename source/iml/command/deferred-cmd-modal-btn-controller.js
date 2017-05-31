//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from '../socket/socket-stream.js';

import {
  resolveStream
} from '../promise-transforms.js';

import {
  map,
  arrayWrap,
  noop
} from 'intel-fp';

export default function DeferredCommandModalBtnCtrl (openCommandModal) {
  'ngInject';

  const setLoading = x => this.loading = x;

  this.openCommandModal = () => {
    setLoading(true);

    const stream = socketStream(this.resourceUri);

    const wrapped = resolveStream(map(arrayWrap, stream));

    openCommandModal(wrapped)
      .resultStream
      .tap(setLoading.bind(null, false))
      .tap(stream.destroy.bind(stream))
      .pull(noop);
  };
}
