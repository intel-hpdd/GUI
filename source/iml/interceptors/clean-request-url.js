//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export function cleanRequestUrlInterceptorFactory () {
  const html = /\.html|\.js$/;
  const slash = /\/$/;

  return {
    request (config) {
      if (html.test(config.url)) return config;

      if (!slash.test(config.url)) config.url += '/';

      return config;
    }
  };
}
