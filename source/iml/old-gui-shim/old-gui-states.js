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

// @flow

export default [
  ['/configure/volume', 'app.oldVolume', 'configureold/volume', 'volumes_tab.htm'],
  ['/configure/power', 'app.oldPower', 'configureold/power', 'power_control_tab.htm'],
  ['/configure/filesystem/create', 'app.oldFilesystemCreate', 'configureold/filesystem/create', 'creating_a_file_system2.htm'],
  ['/configure/filesystem/:id', 'app.oldFilesystemDetail', 'configureold/filesystem/detail', 'file_systems_details_page.htm'],
  ['/configure/user/', 'app.oldUser', '/configureold/user', 'users_tab.htm'],
  ['/configure/user/:id', 'app.oldUserDetail', '/userold'],
  ['/target/:id', 'app.oldTarget', '/targetold'],
  ['/system_status', 'app.oldSystemStatus', '/system_statusold'],
  ['/configure/storage', 'app.oldStorageResource', '/configureold/storage/', 'storage_tab.htm'],
  ['/configure/storage/:id', 'app.oldStorageResourceDetail', '/storage_resourceold']
]
  .map(([url, name, path, helpPage]) => {
    return {
      url,
      name,
      controller: function ($stateParams) {
        'ngInject';

        this.params = $stateParams;
      },
      controllerAs: '$ctrl',
      template: `
      <iframe-shim params="::$ctrl.params" path="${path}"></iframe-shim>
      `,
      data: {
        helpPage
      }
    };
  });