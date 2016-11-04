//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

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

  const selectServerProfileStep = this;

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
    const profile = selectServerProfileStep.profile;
    selectServerProfileStep.profile = (
      profile ?
        _.find(profiles, { name: profile.name }) :
        profiles[0]
    );
  })
  .stopOnError(fp.unary($exceptionHandler))
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

      const getProfiles = _.partial(getHostProfiles, data.spring);

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
