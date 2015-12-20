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


angular.module('statusRecordsRouteModule', [])
  .config(function statusSegment ($routeSegmentProvider) {
    'ngInject';

    var qs;

    var isStatus = fp.flow(
      fp.invokeMethod('path', []),
      RegExp.prototype.test.bind(/^\/status/)
    );

    $routeSegmentProvider
      .within('app')
      .within('statusQuery')
      .segment('statusRecords', {
        controller: 'StatusController',
        controllerAs: 'ctrl',
        templateUrl: 'iml/status/assets/html/status.html',
        watcher: function watcher ($location, segment, qsFromLocation) {
          /* jshint -W034 */
          'ngInject';

          if (!isStatus($location) && segment.clearWatcher)
            segment.clearWatcher();

          return isStatus($location) ? (qs = qsFromLocation()) : qs;
        },
        resolve: {
          notificationStream: function notificationStream (resolveStream, socketStream, qsFromLocation) {
            /* jshint -W034 */
            'ngInject';

            var qs = qsFromLocation();
            if (qs.length)
              qs = '?' + qs;

            return resolveStream(socketStream('/alert/' + qs));
          }
        },
        untilResolved: {
          templateUrl: 'common/loading/assets/html/loading.html'
        }
      });
  });
