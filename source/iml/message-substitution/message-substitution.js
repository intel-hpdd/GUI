// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { GROUPS, groupAllowed } from '../auth/authorization.js';

import { apiPathToUiPath } from '../route-utils.js';

type substitutionT = {
  end: number,
  label: string,
  resource_uri: string,
  start: number
};

export const MessageSubstitutionCtrl = class {
  substituteMessage: string = '';
  substitutions: Array<substitutionT>;
  message: string;
  $compile: Function;
  $element: HTMLElement;
  $scope: Object;

  constructor($scope: Object, $element: HTMLElement[], $compile: Function) {
    'ngInject';
    this.$scope = $scope;
    this.$element = $element[0];
    this.$compile = $compile;
  }
  $onInit() {
    const substitutions = this.substitutions.sort((a, b) => b.start - a.start);

    this.substituteMessage = substitutions.reduce((str, sub) => {
      const start = str.substring(0, sub.start - 1);
      const end = str.substring(sub.end - 1);
      let label = sub.label;

      if (groupAllowed(GROUPS.FS_ADMINS)) {
        const path = apiPathToUiPath(sub.resource_uri);
        label = `<a route-to="${path}">${sub.label}</a>`;
      }

      return start + label + end;
    }, this.message);
  }
  $postLink() {
    const compiledEl = this.$compile(`<div>${this.substituteMessage}</div>`)(this.$scope);
    this.$element.appendChild(compiledEl[0]);
  }
};

export const messageSubstitution = {
  bindings: {
    message: '<',
    substitutions: '<'
  },
  controller: MessageSubstitutionCtrl
};
