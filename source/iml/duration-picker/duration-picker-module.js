// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from "angular";
import uiBootstrapModule from "angular-ui-bootstrap";
import tooltipModule from "../tooltip/tooltip-module.js";
import filtersModule from "../filters/filters-module.js";
import durationPickerComponent from "./duration-picker.js";

export type formControlT = {
  $modelValue: number
};

export type unitControlT = {
  $modelValue: string
};

export type rangeFormT = {
  start: formControlT,
  end: formControlT
};

export type durationFormT = {
  unit: unitControlT,
  size: formControlT
};

export type durationSubmitHandlerT = (
  chartType: string
) => (overrides: Object, forms: { rangeForm: rangeFormT, durationForm: durationFormT }) => void;

export type rangeConfigT = {
  configType: "range",
  startDate: string,
  endDate: string,
  page: string
};

export type durationConfigT = {
  configType: "duration",
  size: number,
  unit: string,
  page: string
};

export type durationPickerConfigT = rangeConfigT | durationConfigT;
export type durationPayloadT = {
  configType: "duration" | "range",
  size: number,
  unit: string,
  page: string,
  startDate: string,
  endDate: string,
  page: string
};

export type durationPayloadHashT = {
  [page: string]: durationPayloadT
};

export default angular
  .module("durationPicker", [uiBootstrapModule, tooltipModule, filtersModule])
  .component("durationPicker", durationPickerComponent).name;
