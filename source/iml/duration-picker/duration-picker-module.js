// @flow

//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

import angular from 'angular';
import uiBootstrapModule from 'angular-ui-bootstrap';
import tooltipModule from '../tooltip/tooltip-module.js';
import filtersModule from '../filters/filters-module.js';
import durationPickerComponent from './duration-picker.js';

export type formControlT = {
  $modelValue:number
};

export type unitControlT = {
  $modelValue:string
};

export type rangeFormT = {
  start:formControlT,
  end:formControlT
};

export type durationFormT = {
  unit:unitControlT,
  size:formControlT
};

export type durationSubmitHandlerT = (chartType:string) =>
  (overrides:Object, forms:{rangeForm:rangeFormT, durationForm:durationFormT}) => void;

export type rangeConfigT = {
  configType:'range',
  startDate:string,
  endDate:string,
  page:string
};

export type durationConfigT = {
  configType:'duration',
  size:number,
  unit:string,
  page:string
};

export type durationPickerConfigT = rangeConfigT | durationConfigT;
export type durationPayloadT = {
  configType:'duration' | 'range',
  size:number,
  unit:string,
  page:string,
  startDate:string,
  endDate:string,
  page:string
};

export type durationPayloadHashT = {
  [page:string]:durationPayloadT
};

export default angular.module('durationPicker', [
  uiBootstrapModule, tooltipModule, filtersModule
])
.component('durationPicker', durationPickerComponent)
.name;
