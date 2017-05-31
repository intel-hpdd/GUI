//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from 'intel-lodash-mixins';

export default function modelFactory () {
  var urlPrefix = '';

  return {
    setUrlPrefix: function (url) {
      urlPrefix = url;
    },
    $get: function ($resource) {
      'ngInject';

      return function getModel (config) {
        var defaults = {
          actions: {
            get: { method: 'GET' },
            save: { method: 'POST' },
            update: { method: 'PUT' },
            delete: { method: 'DELETE' },
            patch: { method: 'PATCH' },
            query: {
              method: 'GET',
              isArray: true
            }
          },
          params: {},
          subTypes: {}
        };

        var merged = _.merge(defaults, config);

        if (merged.url === undefined) throw new Error('A url property must be provided to modelFactory!');

        _(merged.actions).forEach(function (action) {
          action.interceptor = {
            response: function (resp) {
              if (!Resource.subTypes) return resp.resource;

              var boundAddSubTypes = addSubTypes.bind(null, Resource.subTypes);

              if (action.isArray)
                resp.resource.forEach(boundAddSubTypes);
              else
                boundAddSubTypes(resp.resource);

              return resp.resource;
            }
          };
        });

        var Resource = $resource(urlPrefix + merged.url, merged.params, merged.actions);

        return Resource;

        function addSubTypes (subTypes, resource) {
          _(subTypes || {}).forEach(function (SubType, name) {
            if (!resource.hasOwnProperty(name)) return;

            resource[name] = new SubType(resource[name]);

            if (SubType.subTypes) addSubTypes(SubType.subTypes, resource[name]);
          });
        }
      };
    }
  };
}
