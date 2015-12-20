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


angular.module('server')
  .factory('createOrUpdateHostsStream', ['λ', 'socketStream', 'serversToApiObjects', 'CACHE_INITIAL_DATA',
    function createOrUpdateHostsStreamFactory (λ, socketStream, serversToApiObjects, CACHE_INITIAL_DATA) {
      'use strict';

      var defaultProfileResourceUri = _.find(CACHE_INITIAL_DATA.server_profile, { name: 'default' }).resource_uri;

      /**
       * Creates or updates hosts as needed.
       * @param {Object} servers
       * @returns {Highland.Stream}
       */
      return function createOrUpdateHostsStream (servers) {
        var objects = serversToApiObjects(servers);

        return socketStream('/host', {
          qs: { limit: 0 }
        }, true)
          .pluck('objects')
          .flatMap(function handleResponse (servers) {
            var findByAddress = _.findInCollection(['address']);

            var toPost = objects
              .filter(_.compose(_.inverse, findByAddress(servers)))
              .map(addDefaultProfile);

            var postHostStream = updateHostStream('post', toPost);

            var undeployedServers = _.where(servers, { state: 'undeployed' });
            var toPut = _.difference(objects, toPost)
              .filter(findByAddress(undeployedServers))
              .map(addDefaultProfile);

            var putHostStream = updateHostStream('put', toPut);

            var leftovers = _.difference(objects, toPut, toPost);
            var unchangedServers = {
              objects: servers
                .filter(findByAddress(leftovers))
                .map(function buildResponse (server) {
                  return {
                    command_and_host: {
                      command: false,
                      host: server
                    },
                    error: null,
                    traceback: null
                  };
                })
            };

            return λ([postHostStream, putHostStream])
              .merge()
              .collect()
              .map(function combine (responses) {
                responses = responses
                  .concat(unchangedServers)
                  .concat(function concatArrays (a, b) {
                    return Array.isArray(a) ? a.concat(b) : undefined;
                  });

                return _.merge.apply(_, responses);
              });
          });
      };

      /**
       * Add the default server profile
       * when "adding" a host.
       * @param {Object} server
       * @returns {Object}
       */
      function addDefaultProfile (server) {
        server.server_profile = defaultProfileResourceUri;
        return server;
      }

      /**
       * Creates or updates servers.
       * @param {String} method
       * @param {Object} data
       * @returns {Highland.Stream}
       */
      function updateHostStream (method, data) {
        if (data.length === 0)
          return λ([{}]);

        return socketStream('/host', {
          method: method,
          json: { objects: data }
        }, true);
      }
    }
  ]);
