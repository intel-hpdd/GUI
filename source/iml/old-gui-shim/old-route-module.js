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
import iframeShimComponent from './iframe-shim-component.js';

import {
  GROUPS
} from '../auth/authorization.js';

// $FlowIgnore: HTML templates that flow does not recognize.
import loadingTemplate from '../loading/assets/html/loading';

const pathToConfig = (path:string) => {
  return {
    access: GROUPS.FS_ADMINS,
    controller: function ($route) {
      'ngInject';

      this.params = $route.current.params;
    },
    controllerAs: '$ctrl',
    template: `
    <iframe-shim params="::$ctrl.params" path="${path}"></iframe-shim>
    `,
    untilResolved: {
      templateUrl: loadingTemplate
    },
    middleware: [
      'allowAnonymousReadMiddleware',
      'eulaStateMiddleware',
      'authenticationMiddleware'
    ]
  };
};

export default angular.module('oldRoutes', [
  loadingTemplate
])
  .config(function oldRoute ($routeSegmentProvider:Object):void {
    'ngInject';

    $routeSegmentProvider
      .when('/configure/volume', 'app.oldVolume')
      .when('/configure/power', 'app.oldPower')
      .when('/configure/filesystem/create', 'app.oldFilesystemCreate')
      .when('/configure/filesystem/:id', 'app.oldFilesystemDetail')
      .when('/configure/user/', 'app.oldUser')
      .when('/configure/user/:id', 'app.oldUserDetail')
      .when('/target/:id', 'app.oldTarget')
      .when('/system_status', 'app.oldSystemStatus')
      .when('/configure/storage', 'app.oldStorageResource')
      .when('/configure/storage/:id', 'app.oldStorageResourceDetail')
      .within('app')
      .segment('oldVolume', pathToConfig('configureold/volume'))
      .segment('oldPower', pathToConfig('configureold/power'))
      .segment('oldFilesystemCreate', pathToConfig('configureold/filesystem/create'))
      .segment('oldFilesystemDetail', pathToConfig('configureold/filesystem/detail'))
      .segment('oldTarget', pathToConfig('/targetold'))
      .segment('oldUser', pathToConfig('/configureold/user'))
      .segment('oldUserDetail', pathToConfig('/userold'))
      .segment('oldStorageResource', pathToConfig('/configureold/storage/'))
      .segment('oldStorageResourceDetail', pathToConfig('/storage_resourceold'))
      .segment('oldSystemStatus', pathToConfig('/system_statusold'));
  })
  .component('iframeShim', iframeShimComponent)
  .name;
