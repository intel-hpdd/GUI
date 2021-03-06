// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as maybe from "@iml/maybe";
import store from "../store/get-store.js";

import { streamToPromise } from "../promise-transforms.js";

import { matchById } from "../api-transforms.js";

export const oldUserDetailResolve = {
  resolve: {
    getData: ($stateParams: { id: string }) => {
      "ngInject";
      return streamToPromise(store.select("users").filter(xs => xs.length))
        .then(matchById($stateParams.id))
        .then(maybe.map.bind(null, (x: Object) => ({ label: x.username })))
        .then(maybe.withDefault.bind(null, () => ({ label: "" })));
    }
  }
};

export const oldTargetResolve = {
  resolve: {
    getData: ($stateParams: { id: string }) => {
      "ngInject";
      return streamToPromise(store.select("targets").map(Object.values)).then(matchById($stateParams.id));
    }
  }
};
