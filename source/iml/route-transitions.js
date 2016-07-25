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

// @flow

import {
  CACHE_INITIAL_DATA
} from './environment.js';

import {
  authorization
} from './auth/authorization.js';

export default function routeTransitions ($transitions, navigate) {
  'ngInject';

  const allowAnonymousReadPredicate = {
    to: state => {
      return state.data && state.data.anonymousReadProtected === true;
    }
  };

  const processAllowAnonymousRead = () => {
    var session = CACHE_INITIAL_DATA.session;

    if (!session.read_enabled)
      return new Promise(() => navigate('login'));
  };

  const eulaStatePredicate = {
    to: state => {
      return state.data && state.data.eulaState === true;
    }
  };

  const processEulaState = () => {
    var session = CACHE_INITIAL_DATA.session;

    if (session.user && session.user.eula_state !== 'pass')
      return new Promise(() => navigate('login'));
  };

  const authenticationPredicate = {
    to: state => {
      return state.data && state.data.access != null;
    }
  };

  const processAuthentication = transition => {
    const authenticated = authorization
      .groupAllowed(transition.to().data.access);

    if (!authenticated) {
      let $state = transition.router.stateService;
      return $state.target('app', undefined, {location: true});
    }
  };

  $transitions.onStart(allowAnonymousReadPredicate, processAllowAnonymousRead);
  $transitions.onStart(eulaStatePredicate, processEulaState);
  $transitions.onStart(authenticationPredicate, processAuthentication);
}
