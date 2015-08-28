//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2015 Intel Corporation All Rights Reserved.
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

angular.module('imlRouterModule')
  .factory('hasAccess', ['$route', 'authorization', '$location', '$rootScope', '$q',
    function ($route, authorization, $location, $rootScope, $q) {
      /**
       * Determines if the user has access to the specified route given their access (on the params object). If they
       * have access, it will resolve immediately. If, however, they do not have access, it will do one of two actions:
       * 1. If readEnabled is true it will route to the dashboard
       * 2. If readEnabled is false it will route to the login screen
       * @param {Object} params The params associated with the route
       * @returns {$q.promise}
       */
      return function hasAccess (params) {
        var authenticated = authorization.groupAllowed(params.access);

        if (authenticated)
          return $q.when();

        var targetLocation = {
          controller: 'BaseDashboardCtrl',
          templateUrl: 'iml/dashboard/assets/html/base-dashboard.html'
        };

        var targetPath = '/';

        if (!authorization.readEnabled) {
          targetLocation = {
            controller: 'LoginCtrl',
            controllerAs: 'login',
            templateUrl: 'common/login/assets/html/login.html'
          };
          targetPath = '/login';
        }

        // Handle case where not authenticated
        params.resolveFailed = targetLocation;
        $location.path(targetPath);

        return $q.reject();
      };
    }]);
