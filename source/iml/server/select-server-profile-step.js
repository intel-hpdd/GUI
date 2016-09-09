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

import angular from 'angular';
import highland from 'highland';
import _ from 'intel-lodash-mixins';
import * as fp from 'intel-fp';

import {
  getCommandAndHost
} from './server-transforms.js';

import {
  rememberValue
} from '../api-transforms.js';

import {
  resolveStream
} from '../promise-transforms.js';

// $FlowIgnore: HTML templates that flow does not recognize.
import selectServerProfileStepTemplate from './assets/html/select-server-profile-step.html!text';

export function SelectServerProfileStepCtrl ($scope, $stepInstance, $exceptionHandler, OVERRIDE_BUTTON_TYPES,
                                             data, hostProfileStream, createHostProfiles, localApply) {
  'ngInject';

  angular.merge(this, {
    pdsh: data.pdsh,
    transition: function transition (action) {
      if (action === OVERRIDE_BUTTON_TYPES.OVERRIDE)
        return;

      this.disabled = true;

      hostProfileStream.destroy();

      if (action === 'previous')
        return $stepInstance.transition(action, { data: data });

      createHostProfiles(this.profile, action === OVERRIDE_BUTTON_TYPES.PROCEED)
        .pull(function pullToken (err) {
          if (err)
            throw err;

          $stepInstance.end();
        });
    },
    onSelected: function onSelected (profile) {
      this.overridden = false;
      this.profile = profile;
    },
    getHostPath: function getHostPath (item) {
      return item.address;
    },
    pdshUpdate: function pdshUpdate (pdsh, hostnames, hostnamesHash) {
      this.hostnamesHash = hostnamesHash;
    },
    close: function close () {
      $scope.$emit('addServerModal::closeModal');
    }
  });

  var selectServerProfileStep = this;

  hostProfileStream.tap(function (profiles) {
    profiles.sort(function sortProfiles (a, b) {
      if (a.invalid === true)
        return 1;
      else if (b.invalid === true)
        return -1;
      else
        return 0;
    });

    selectServerProfileStep.profiles = profiles;

    // Avoid a stale reference here by
    // pulling off the new value if we already have a profile.
    var profile = selectServerProfileStep.profile;
    selectServerProfileStep.profile = (
      profile ?
        _.find(profiles, { name: profile.name }) :
        profiles[0]
    );
  })
  .stopOnError(fp.curry(1, $exceptionHandler))
  .each(localApply.bind(null, $scope));
}

export function selectServerProfileStep () {
  'ngInject';

  return {
    template: selectServerProfileStepTemplate,
    controller: 'SelectServerProfileStepCtrl as selectServerProfile',
    onEnter: function onEnter (
      data,
      createOrUpdateHostsStream,
      getHostProfiles,
      waitForCommandCompletion,
      showCommand
    ) {
      'ngInject';

      var getProfiles = _.partial(getHostProfiles, data.spring);

      const waitForCommand = fp.flow(
        fp.map(
          x => x.command
        ),
        fp.filter(Boolean),
        x =>
          x.length ? waitForCommandCompletion(showCommand, x): highland([])
      );

      const hostProfileStream = createOrUpdateHostsStream(data.servers)
        .through(getCommandAndHost)
        .through(
          rememberValue(
            waitForCommand
          )
        )
        .map(
          fp.map(
            x => x.host
          )
        )
        .flatMap(getProfiles);

      return {
        data,
        hostProfileStream: resolveStream(hostProfileStream)
      };
    },
    transition: function transition (steps) {
      return steps.serverStatusStep;
    }
  };
}
