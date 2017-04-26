//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default function modelFactory() {
  let urlPrefix = '';

  return {
    setUrlPrefix: function(url) {
      urlPrefix = url;
    },
    $get: function($resource) {
      'ngInject';
      return function getModel({ url, params = {} }) {
        const conf = {
          url,
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
          params: {
            ...params
          },
          subTypes: {}
        };

        if (conf.url === undefined)
          throw new Error('A url property must be provided to modelFactory!');

        Object.values(conf.actions).forEach(function(action) {
          action.interceptor = {
            response: function(resp) {
              if (!Resource.subTypes) return resp.resource;

              const boundAddSubTypes = addSubTypes.bind(
                null,
                Resource.subTypes
              );

              if (action.isArray) resp.resource.forEach(boundAddSubTypes);
              else boundAddSubTypes(resp.resource);

              return resp.resource;
            }
          };
        });

        const Resource = $resource(
          urlPrefix + conf.url,
          conf.params,
          conf.actions
        );

        return Resource;

        function addSubTypes(subTypes = {}, resource) {
          Object.entries(subTypes).forEach(([name, SubType]) => {
            if (!resource.hasOwnProperty(name)) return;

            resource[name] = new SubType(resource[name]);

            if (SubType.subTypes) addSubTypes(SubType.subTypes, resource[name]);
          });
        }
      };
    }
  };
}
