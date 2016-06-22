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
  GROUPS
} from '../auth/authorization.js';

type substitutionT = {
  end: number,
  label: string,
  resource_uri: string,
  start: number
};

export const MessageSubstitutionCtrl = ($scope:Object) => {
  'ngInject';

  $scope.ctrl.GROUPS = GROUPS;
  const substitutions = $scope.ctrl.substitutions
    .sort((a, b) => a.start - b.start);
  const substitutionsHash = substitutions.reduce((outHash, sub) => {
    outHash[sub.start + '-' + sub.end] = sub;

    return outHash;
  }, {});
  const message = $scope.ctrl.message;
  const groups = computeGroups(message, substitutions);
  const replacedGroups = substituteGroups(groups, substitutionsHash);

  $scope.ctrl.substitutedMessage = replacedGroups.join('');

};

function substituteGroups (groups, substitutionsHash) {
  return Object.keys(groups).reduce((outGroups, key) => {
    var label = groups[key];
    var substitution = substitutionsHash[key];
    if (substitution)
      label = `<a href="${substitution.resource_uri}">${substitution.label}</a>`;

    outGroups.push(label);
    return outGroups;
  }, []);
}

function computeGroups (message, substitutions:Array<substitutionT>) {
  var groupLocation = 0;
  const groups = substitutions.reduce((outGroups, sub) => {
    outGroups[(groupLocation + 1) + '-' + (sub.start - 1)] =
      message.substring(
        groupLocation - 1,
        sub.start - 1
      );

    outGroups[sub.start + '-' + sub.end] = message.substring(
      sub.start - 1,
      sub.end - 1
    );

    groupLocation = sub.end;
    return outGroups;
  }, {});

  if (groupLocation < message.length)
    groups[(groupLocation + 1) + '-' + message.length] = message.substring(groupLocation - 1);

  return groups;
}

export const messageSubstitution = () => {
  'ngInject';

  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      message: '=',
      substitutions: '='
    },
    controller: 'MessageSubstitutionCtrl',
    controllerAs: 'ctrl',
    template: '<div restrict-to="{{ ctrl.GROUPS.FS_ADMINS }}">{{ctrl.substitutedMessage}}</div>'
  };
};
