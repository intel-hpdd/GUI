//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import cdtStatusTemplate from './assets/html/cdt-status.html';

export default function hsmCdtStatusDirective() {
  return {
    scope: {
      fileSystem: '='
    },
    restrict: 'E',
    template: cdtStatusTemplate
  };
}
