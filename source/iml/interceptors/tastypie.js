//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export function tastypieInterceptorFactory () {
  return {
    response (resp) {
      const fromTastyPie = resp.data && resp.data.meta && Array.isArray(resp.data.objects);

      if (fromTastyPie) {
        const temp = resp.data.objects;

        resp.props = resp.data;
        delete resp.data.objects;

        resp.data = temp;
      }

      return resp;
    }
  };
}
