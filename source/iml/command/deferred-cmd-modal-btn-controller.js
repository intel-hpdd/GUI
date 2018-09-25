// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import socketStream from "../socket/socket-stream.js";

import { resolveStream } from "../promise-transforms.js";

import type { Command } from "./command-types.js";

import type { HighlandStreamT } from "highland";

type openCommandModalT = (x: Promise<HighlandStreamT<Command[]>>) => Object;

export default function DeferredCommandModalBtnCtrl(openCommandModal: openCommandModalT) {
  "ngInject";
  const setLoading = x => (this.loading = x);

  this.openCommandModal = () => {
    setLoading(true);

    const stream = socketStream(this.resourceUri);

    const wrapped = resolveStream(stream.map(fp.arrayWrap));

    openCommandModal(wrapped)
      .resultStream.tap(setLoading.bind(null, false))
      .tap(stream.destroy.bind(stream))
      .pull(fp.noop);
  };
}
