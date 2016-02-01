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
import extendScopeModule from '../extend-scope-module';
import socketModule from '../socket/socket-module';
import commandModule from '../command/command-module';
import corosyncStateComponent from './corosync-state';
import filterModule from '../filters/filters-module';
import {ConfigureCorosyncController, configureCorosyncComponent} from './configure-corosync';
import bigDifferModule from 'intel-big-differ';

// $FlowIgnore: HTML templates that flow does not recognize.
import configureCorosyncTemplate from './assets/html/configure-corosync';

export default angular
  .module('corosyncModule', [
    extendScopeModule,
    socketModule,
    commandModule,
    bigDifferModule,
    filterModule,
    configureCorosyncTemplate
  ])
  .component('corosyncState', corosyncStateComponent)
  .controller('ConfigureCorosyncController', ConfigureCorosyncController)
  .component('configureCorosync', configureCorosyncComponent)
  .name;
