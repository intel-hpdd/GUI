// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import {
  CACHE_INITIAL_DATA
} from './environment.js';

import {
  authorization
} from './auth/authorization.js';

import type {
  TransitionServiceT,
  StateDeclarationT
} from 'angular-ui-router';

export type routeStateT = StateDeclarationT & {
  data?:{
    parent?:string,
    anonymousReadProtected?:boolean,
    eulaState?:boolean,
    helpPage?:string,
    label?:string,
    parentName?:string,
    access?:string
  }
};

export default function routeTransitions ($transitions:TransitionServiceT, navigate:Function) {
  'ngInject';

  const allowAnonymousReadPredicate = {
    to: state => {
      return state.data && state.data.anonymousReadProtected === true;
    }
  };

  const processAllowAnonymousRead = () => {
    const session = CACHE_INITIAL_DATA.session;

    if (!session.read_enabled)
      return new Promise(() => navigate('login'));
  };

  const eulaStatePredicate = {
    to: state => {
      return state.data && state.data.eulaState === true;
    }
  };

  const processEulaState = () => {
    const session = CACHE_INITIAL_DATA.session;

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
      const $state = transition.router.stateService;
      return $state.target('app', undefined, {location: true});
    }
  };

  $transitions.onStart(allowAnonymousReadPredicate, processAllowAnonymousRead);
  $transitions.onStart(eulaStatePredicate, processEulaState);
  $transitions.onStart(authenticationPredicate, processAuthentication);
}
