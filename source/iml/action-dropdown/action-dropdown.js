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

export function ActionDropdownCtrl($element: HTMLElement[]) {
  "ngInject";

  const ctrl = this;
  ctrl.uuid = getRandomValue().toString();

  ctrl.$onInit = () => {
    const div = $element[0].querySelector("div");
    div.id = ctrl.uuid;

    ctrl.stream
      .map(x => (Array.isArray(x) ? x : [x]))
      .take(1)
      .each(servers => {
        const records = servers.map(record => [record.content_type_id, record.id, record.label]);

        const { render } = global.wasm_bindgen;
        ctrl.destroyComponent = render({ uuid: ctrl.uuid, records, locks: ctrl.locks });
      });
  };

  ctrl.$onDestroy = () => {
    ctrl.destroyComponent();
  };
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
<div>
</div>
`
};
