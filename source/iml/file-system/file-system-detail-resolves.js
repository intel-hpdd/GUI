// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from "../store/get-store.js";

import { streamToPromise } from "../promise-transforms.js";

export const getData = $stateParams => {
  "ngInject";
  return streamToPromise(store.select("fileSystems").map(Object.values)).then(xs =>
    xs.find(x => x.id === Number.parseInt($stateParams.id))
  );
};

export const fileSystem$ = $stateParams => {
  "ngInject";

  return store
    .select("fileSystems")
    .map(Object.values)
    .map(xs => xs.find(x => x.id === Number.parseInt($stateParams.id)));
};

export const target$ = $stateParams => {
  "ngInject";

  const id = Number.parseInt($stateParams.id);

  return store.select("targets").map(x =>
    Object.entries(x).reduce((acc, [k, x]) => {
      const shouldKeep =
        (x.kind === "OST" && x.filesystem_id === id) ||
        (x.kind === "MDT" && x.filesystem_id === id) ||
        (x.kind === "MGT" && x.filesystems.some(y => y.id === id));

      if (shouldKeep) acc[k] = x;

      return acc;
    }, {})
  );
};

export const server$ = () => store.select("server");

export const locks$ = () => store.select("locks");

export const alertIndicator$ = () => store.select("alertIndicators").map(Object.values);

export const stratagemConfiguration$ = $stateParams => {
  "ngInject";

  return store
    .select("stratagem")
    .map(Object.values)
    .map(xs => xs.find(x => x.filesystem_id === Number.parseInt($stateParams.id)));
};
