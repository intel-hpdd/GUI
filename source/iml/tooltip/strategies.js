//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default () => {
  'ngInject';

  return function (jqElement, scope, events) {
    let deregisterEvents;

    function applyAnd (func) {
      return function () { scope.$apply(func); };
    }

    if (jqElement.is('a')) {
      const applyAndShow = applyAnd(events.show);
      const applyAndHide = applyAnd(events.hide);

      jqElement.on('mouseenter', applyAndShow);
      jqElement.on('mouseleave', applyAndHide);

      deregisterEvents = function () {
        jqElement.off('mouseenter', applyAndShow);
        jqElement.off('mouseleave', applyAndHide);
      };
    }

    return function deregister () {
      deregisterEvents();

      scope = null;
      jqElement = null;
      events = null;
    };
  };
};
