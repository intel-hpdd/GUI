//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2014 Intel Corporation All Rights Reserved.
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

angular.module('server')
  .factory('serverStreamsResolves', [
    '$q', 'resolveStream', 'addProperty',
    'socketStream', 'jobMonitor', 'alertMonitor', 'getServersStream',
    function serverStreamsResolvesFactory ($q, resolveStream, addProperty,
                                           socketStream, jobMonitor, alertMonitor, getServersStream) {
      'use strict';

      return function serverStreamsResolves () {
        var jobMonitorStream = resolveStream(jobMonitor())
          .then(function addThroughProperty (jobMonitorStream) {
            return jobMonitorStream.through(addProperty);
          });

        var alertMonitorStream = resolveStream(alertMonitor())
          .then(function addThroughProperty (alertMonitorStream) {
            return alertMonitorStream.through(addProperty);
          });

        var s = socketStream('/lnet_configuration/', {
          jsonMask: 'objects(state,host/id)'
        });
        var s2 = s.pluck('objects');
        s2.destroy = s.destroy.bind(s);

        var lnetConfigurationStream = resolveStream(s2)
          .then(function addThroughProperty (lnetConfigurationStream) {
            return lnetConfigurationStream.through(addProperty);
          });

        var cs = socketStream('/corosync_configuration', {
          jsonMask: 'objects(state,host)',
          qs: {
            limit: 0
          }
        });

        var cs2 = cs
          .pluck('objects');
        cs2.destroy = cs.destroy.bind(cs);

        var corosyncConfigurationStream = resolveStream(cs2)
          .then(function addThroughProperty (s) {
            return s.through(addProperty);
          });

        return $q.all({
          jobMonitorStream: jobMonitorStream,
          alertMonitorStream: alertMonitorStream,
          lnetConfigurationStream: lnetConfigurationStream,
          corosyncConfigurationStream: corosyncConfigurationStream,
          serversStream: getServersStream()
        });
      };
    }]);
