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

import {lensProp, map} from 'intel-fp/fp';


var objectsLens = lensProp('objects');

angular.module('server')
  .factory('getHostProfiles', function getHostProfilesFactory (CACHE_INITIAL_DATA) {
    'ngInject';

    return function getHostProfiles (spring, hosts) {
      var stream = spring('hostProfile', '/host_profile', {
        qs: {
          id__in: _.pluck(hosts, 'id'),
          server_profile__user_selectable: true,
          limit: 0
        }
      });

      return stream
        .map(objectsLens)
        .tap(function throwIfError (x) {
          if (x.error)
            throw new Error(x.error);
        })
        .map(map(lensProp('host_profiles')))
        .map(function (hosts) {
          // Pull out the profiles and flatten them.
          var profiles = [{}]
            .concat(_.pluck(hosts, 'profiles'))
            .concat(function concatArrays (a, b) {
              return _.isArray(a) ? a.concat(b) : undefined;
            });
          var merged = _.merge.apply(_, profiles);

          return Object.keys(merged).reduce(function buildStructure (arr, profileName) {
            var item = {
              name: profileName,
              uiName: _.find(CACHE_INITIAL_DATA.server_profile, { name: profileName }).ui_name,
              invalid: merged[profileName].some(didProfileFail)
            };

            item.hosts = hosts.map(function setHosts (host) {
              const profiles = host.profiles[profileName].filter(didProfileFail);

              return {
                address: host.address,
                invalid: profiles.some(didProfileFail),
                problems: profiles,
                uiName: item.uiName
              };
            });

            arr.push(item);

            return arr;
          }, []);
        });

      function didProfileFail (profile) {
        return !profile.pass;
      }
    };
  })
  .factory('createHostProfiles',
    function createHostProfilesFactory (socketStream, waitForCommandCompletion) {
      'ngInject';

      return function createHostProfiles (profile, showCommands) {
        var findInProfiles = _.findInCollection(['address'], profile.hosts);
        var createHostProfilesStream = _.partialRight(_.partial(socketStream, '/host_profile'), true);

        return socketStream('/host', {
          jsonMask: 'objects(id,address,server_profile)',
          qs: { limit: 0 }
        }, true)
          .map(objectsLens)
          .map(_.ffilter(function limitToUnconfigured (server) {
            return server.server_profile && server.server_profile.initial_state === 'unconfigured';
          }))
          .map(_.ffilter(findInProfiles))
          .map(_.fmap(function buildProfiles (server) {
            return {
              host: server.id,
              profile: profile.name
            };
          }))
          .map(function buildRequest (hostProfiles) {
            return {
              method: 'post',
              json: {
                objects: hostProfiles
              }
            };
          })
          .flatMap(createHostProfilesStream)
          .map(objectsLens)
          .map(_.fmap(function getCommands (obj) {
            return { command: obj.commands[0] };
          }))
          .flatMap(waitForCommandCompletion(showCommands));
      };
    }
  );
