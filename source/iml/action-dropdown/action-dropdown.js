//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import global from "../global.js";
import getCommandStream from "../command/get-command-stream.js";
import groupActions from "./group-actions.js";
import { getWriteLocks } from "../locks/locks-utils.js";
import { type CompositeIdT, compositeIdsToQueryString } from "../api-utils.js";
import socketStream from "../socket/socket-stream.js";
import highland from "highland";
import getRandomValue from "../get-random-value.js";

export function actionDescriptionCache($sce) {
  "ngInject";
  const cache = {};

  return function sceDescriptionCache(str) {
    return cache[str] || (cache[str] = $sce.trustAsHtml(str));
  };
}

const actionsTransformer = (actionsProperty, server) => s =>
  s.map(actions => ({
    ...server,
    [actionsProperty]: [...actions]
  }));

export function ActionDropdownCtrl($scope) {
  "ngInject";

  const ctrl = this;
  ctrl.uuid = getRandomValue();

  // const { render } = global.wasm_bindgen;
  // render([[62, 1], [62, 2]]);
}

export const actionDropdown = {
  bindings: {
    tooltipPlacement: "@?",
    actionsProperty: "@?",
    stream: "<",
    locks: "<",
    overrideClick: "&?"
  },
  controller: "ActionDropdownCtrl",
  template: `
<div id="{{$ctrl.uuid}}">
  <span>test</span>
</div>
`
};
