//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export function addStaticDirInterceptorFactory(STATIC_URL) {
  'ngInject';
  const html = /\.html$/;
  const uiBootstrap = /template\/.+\.html$/;
  const slash = /^\//;

  return {
    request(config) {
      if (!html.test(config.url) || uiBootstrap.test(config.url)) return config;

      if (slash.test(config.url)) config.url = config.url.slice(1);

      config.url = STATIC_URL + config.url;

      return config;
    }
  };
}
