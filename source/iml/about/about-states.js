//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import aboutTemplate from './assets/html/about.html!text';

export const aboutState = {
  name: 'app.about',
  url: '/about',
  controller: 'AboutCtrl',
  controllerAs: 'about',
  template: aboutTemplate,
  params: {
    resetState: {
      dynamic: true
    }
  },
  data: {
    anonymousReadProtected: true,
    eulaState: true,
    kind: 'About Intel® Manager for Lustre* software',
    icon: 'fa-info-circle'
  }
};
