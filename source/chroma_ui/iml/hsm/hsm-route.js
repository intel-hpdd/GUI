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


angular.module('hsm')
  .config(function hsmSegment ($routeSegmentProvider, GROUPS) {
    $routeSegmentProvider
      .when('/configure/hsm/:fsId?', 'app.hsmFs.hsm')
      .within('app')
      .segmentAuthenticated('hsmFs', {
        controller: 'HsmFsCtrl',
        controllerAs: 'hsmFs',
        templateUrl: 'iml/hsm/assets/html/hsm-fs.html',
        access: GROUPS.FS_ADMINS,
        resolve: {
          fsStream: /*@ngInject*/ function fsCollStream (resolveStream, socketStream, addProperty) {
            return resolveStream(socketStream('/filesystem', {
              jsonMask: 'objects(id,label,cdt_status,hsm_control_params,locks)'
            }))
              .then(function addThroughProperty (s) {
                var s2 = fp.map(fp.lensProp('objects'), s);

                s2.destroy = s.destroy.bind(s);

                return s2.through(addProperty);
              });
          },
          copytoolStream: /*@ngInject*/ function copytoolStream (resolveStream, socketStream) {
            return resolveStream(socketStream('/copytool', {
              jsonMask: 'objects(id)'
            }));
          }
        },
        untilResolved: {
          templateUrl: 'common/loading/assets/html/loading.html'
        }
      });

    var routePath = fp.pathLens(['current', 'params', 'fsId']);
    var fsIdPath = fp.pathLens(['qs', 'filesystem_id']);

    $routeSegmentProvider
      .within('app')
      .within('hsmFs')
      .segment('hsm', {
        controller: 'HsmCtrl',
        controllerAs: 'hsm',
        templateUrl: 'iml/hsm/assets/html/hsm.html',
        resolve: {
          copytoolOperationStream: /*@ngInject*/ function copytoolOperationStream (resolveStream,
                                                                                   getCopytoolOperationStream, $route) {
            var val = routePath($route);
            var params = val ? fsIdPath.set(val, {}) : {};

            return resolveStream(getCopytoolOperationStream(params));
          },
          copytoolStream: /*@ngInject*/ function copytoolStream (resolveStream, getCopytoolStream, $route) {
            var val = routePath($route);
            var params = val ? fsIdPath.set(val, {}) : {};

            return resolveStream(getCopytoolStream(params));
          }
        },
        untilResolved: {
          templateUrl: 'common/loading/assets/html/loading.html'
        },
        dependencies: ['fsId']
      });
  });
