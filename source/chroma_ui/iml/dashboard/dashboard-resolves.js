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

angular.module('dashboard')
  .factory('dashboardFsStream', function dashboardFsStreamFactory (resolveStream, socketStream, addProperty) {
    return function dashboardFsStream () {
      return resolveStream(socketStream('/filesystem', {
        jsonMask: 'objects(id,label)',
        qs: { limit: 0 }
      }))
        .then(function addThroughProperty (s) {
          var s2 = s
            .pluck('objects');

          s2.destroy = s.destroy.bind(s);

          return s2.through(addProperty);
        });
    };
  })
  .factory('dashboardHostStream', function dashboardHostStreamFactory (resolveStream, socketStream, addProperty) {
    return dashboardStreamFactory(resolveStream, socketStream, addProperty, '/host', {
      jsonMask: 'objects(id,label)',
      qs: { limit: 0 }
    });
  })
  .factory('dashboardTargetStream', function dashboardTargetStreamFactory (resolveStream, socketStream, addProperty) {
    return dashboardStreamFactory(resolveStream, socketStream, addProperty, '/target', {
      jsonMask: 'objects(id,label,kind,filesystems,filesystem_id,failover_servers,primary_server)',
      qs: { limit: 0 }
    });
  });

function dashboardStreamFactory (resolveStream, socketStream, addProperty, path, opts) {
  return function dashboardStream () {
    return resolveStream(socketStream(path, opts))
      .then(function addThroughProperty (s) {
        return s.through(addProperty);
      });
  };
}
