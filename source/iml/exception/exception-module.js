// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from "angular";
import filtersModule from "../filters/filters-module.js";
import uiBootstrapModule from "angular-ui-bootstrap";
import exceptionHandlerConfig from "./exception-handler.js";
import exceptionModalFactory from "./exception-modal.js";
import ExceptionModalCtrl from "./exception-modal-controller.js";
import getStore from "../store/get-store.js";
import { ExceptionModalComponent } from "./exception-handler.js";
import { render } from "inferno";
import global from "../global.js";
import { querySelector } from "../dom-utils";

export default angular
  .module("exceptionModule", [uiBootstrapModule, filtersModule])
  .config(exceptionHandlerConfig)
  .factory("exceptionModal", exceptionModalFactory)
  .controller("ExceptionModalCtrl", ExceptionModalCtrl).name;

const container = document.createElement("div");
getStore.select("exceptionModal").each((e: Error) => {
  if (e == null) return;

  const body = querySelector(global.document, "body");
  body.appendChild(container);
  render(<ExceptionModalComponent exception={e} />, container);
});
