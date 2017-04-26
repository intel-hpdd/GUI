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

export default function AppCtrl(
  $scope,
  session,
  navigate,
  ENV,
  GROUPS,
  help,
  notificationStream,
  alertStream
) {
  'ngInject';
  const login = navigate.bind(null, 'login/');

  angular.extend(this, {
    RUNTIME_VERSION: ENV.RUNTIME_VERSION,
    COPYRIGHT_YEAR: help.get('copyright_year'),
    GROUPS,
    session,
    status: {},
    user: session.user,
    loggedIn: loggedIn(),
    onClick: loggedIn() ? logout : login,
    isCollapsed: true,
    login,
    logout,
    alertStream
  });

  function loggedIn() {
    return session.user && session.user.id != null;
  }

  function logout() {
    return session.$delete().then(login);
  }

  const LIMIT = 99;

  const ctrl = this;

  const p = $scope.propagateChange.bind(null, $scope, this, 'status');

  notificationStream
    .tap(function computeProperties(status) {
      status.aboveLimit = status.count > LIMIT;

      status.count = status.aboveLimit ? LIMIT : status.count;

      ctrl.link = '/ui/status/';

      if (status.health !== 'GOOD')
        ctrl.link += '?severity__in=WARNING,ERROR&active=true';
    })
    .through(p);

  $scope.$on('$destroy', () => {
    alertStream.destroy();
    notificationStream.destroy();
  });
}
