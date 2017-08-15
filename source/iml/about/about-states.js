//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const aboutState = {
  name: 'app.about',
  url: '/about',
  component: 'aboutComponent',
  params: {
    resetState: {
      dynamic: true
    }
  },
  data: {
    anonymousReadProtected: true,
    kind: 'About Intel® Manager for Lustre* software',
    icon: 'fa-info-circle'
  }
};
