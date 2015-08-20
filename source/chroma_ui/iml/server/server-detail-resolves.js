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

angular.module('server')
  .factory('serverDetailResolves',
    function serverDetailResolvesFactory ($q, resolveStream, addProperty, jobMonitor,
                                          alertMonitor, socketStream, getNetworkInterfaceStream) {
      return function serverDetailResolves ($route) {
        var jobMonitorStream = resolveStream(jobMonitor())
          .then(function addThroughProperty (jobMonitorStream) {
            return jobMonitorStream.through(addProperty);
          });

        var alertMonitorStream = resolveStream(alertMonitor())
          .then(function addThroughProperty (alertMonitorStream) {
            return alertMonitorStream.through(addProperty);
          });

        var serverStream = resolveStream(socketStream('/host/' + $route.current.params.id, {
          jsonMask: 'available_actions,resource_uri,address,fqdn,nodename,server_profile/ui_name,\
boot_time,state_modified_at,id,member_of_active_filesystem,locks,state'
        }));

        var allHostMatches = {
          qs: {
            host__id: $route.current.params.id,
            limit: 0
          }
        };

        var merge = fp.curry(3, _.merge)(fp.__, fp.__, allHostMatches);

        var s = socketStream('/lnet_configuration/', merge({}, {
          jsonMask: 'objects(available_actions,state,host/id,resource_uri,locks)'
        }));

        var s2 = s
          .pluck('objects')
          .flatten();
        s2.destroy = s.destroy.bind(s);

        var lnetConfigurationStream = resolveStream(s2)
          .then(function addThroughProperty (lnetConfigurationStream) {
            return lnetConfigurationStream.through(addProperty);
          });

        var networkInterfaceStream = resolveStream(getNetworkInterfaceStream(merge({}, {
          jsonMask: 'objects(id,inet4_address,name,nid,lnd_types)'
        })));

        var cs = socketStream('/corosync_configuration', merge({}, {
          jsonMask: 'objects(resource_uri,available_actions,mcast_port,locks,state,id)'
        }));

        var cs2 = cs
          .pluck('objects')
          .flatten();
        cs2.destroy = cs.destroy.bind(cs);

        var corosyncConfigurationStream = resolveStream(cs2)
          .then(function addThroughProperty (s) {
            return s.through(addProperty);
          });

        return $q.all({
          jobMonitorStream: jobMonitorStream,
          alertMonitorStream: alertMonitorStream,
          serverStream: serverStream,
          lnetConfigurationStream: lnetConfigurationStream,
          networkInterfaceStream: networkInterfaceStream,
          corosyncConfigurationStream: corosyncConfigurationStream
        });
      };
  });
