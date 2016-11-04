// @flow

//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

import {
  GROUPS,
  authorization
} from '../auth/authorization.js';

import {
  apiPathToUiPath
} from '../route-utils.js';

type substitutionT = {
  end:number,
  label:string,
  resource_uri:string,
  start:number
};

export const MessageSubstitutionCtrl = class {
  substituteMessage:string = '';
  substitutions:Array<substitutionT>;
  message:string;
  $compile:Function;
  $element:HTMLElement;
  $scope:Object;

  constructor ($scope:Object, $element:HTMLElement[], $compile:Function) {
    'ngInject';

    this.$scope = $scope;
    this.$element = $element[0];
    this.$compile = $compile;

    const substitutions = this.substitutions
      .sort((a, b) => b.start - a.start);

    this.substituteMessage = substitutions.reduce((str, sub) => {
      const start = str.substring(0, sub.start -1);
      const end = str.substring(sub.end - 1);
      let label = sub.label;

      if (authorization.groupAllowed(GROUPS.FS_ADMINS)) {
        const path = apiPathToUiPath(sub.resource_uri);
        label = `<a route-to="${path}">${sub.label}</a>`;
      }

      return start + label + end;

    }, this.message);
  }

  $postLink () {
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
