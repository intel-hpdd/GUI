//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

// @flow

import {
  CACHE_INITIAL_DATA
} from './environment.js';

import {
  authorization
} from './auth/authorization.js';

export type routeStateT = {
  abstract?:boolean,
  name:string,
  url?:string,
  controller?:string,
  controllerAs?:string,
  templateUrl?:string,
  template?:string,
  params?:Object,
  data?:{
    parent?:string,
    anonymousReadProtected?:boolean,
    eulaState?:boolean,
    helpPage?:string,
    label?:string,
    parentName?:string,
    access?:string
  },
  resolve?:Object
};

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
