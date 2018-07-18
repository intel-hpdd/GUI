//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default UI_ROOT => {
  'ngInject';
  return {
    priority: 99, // it needs to run after the attributes are interpolated
    link: function routeToLink(scope, element, attr) {
      attr.$observe('routeTo', function routeToObserver(value) {
        attr.$set('href', UI_ROOT + value);
      });
    }
  };
};
