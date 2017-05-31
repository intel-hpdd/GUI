//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export function navigateFactory ($window, UI_ROOT) {
  'ngInject';

  return function navigate (part) {
    if (part == null) part = '';

    $window.location.href = UI_ROOT + part;
  };
}
