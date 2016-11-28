// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from './store/get-store.js';
import {
  streamToPromise
} from './promise-transforms.js';

import {
  groupAllowed
} from './auth/authorization.js';

import type {
  TransitionServiceT,
  StateDeclarationT,
  StateServiceT
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

export default function routeTransitions ($transitions:TransitionServiceT, $state:StateServiceT) {
  'ngInject';

  const allowAnonymousReadPredicate = {
    to: state => {
      return state.data && state.data.anonymousReadProtected === true;
    }
  };

  const processAllowAnonymousRead = () =>
    streamToPromise(
      store
        .select('session')
    )
    .then(({session}) => {
      if (!session.read_enabled)
        return $state.target('login');
    });

  const eulaStatePredicate = {
    to: state => {
      return state.data && state.data.eulaState === true;
    }
  };

  const processEulaState = () =>
    streamToPromise(
      store
        .select('session')
    )
    .then(({session}) => {
      if (session.user && session.user.eula_state !== 'pass')
        return $state.target('login');
    });

  const authenticationPredicate = {
    to: state => {
      return state.data && state.data.access != null;
    }
  };

  const processAuthentication = transition => {
    const authenticated = groupAllowed(transition.to().data.access);

    if (!authenticated)
      return $state.target(
        'app',
        undefined,
        {
          location: true
        }
      );
  };

  $transitions.onStart(allowAnonymousReadPredicate, processAllowAnonymousRead);
  $transitions.onStart(eulaStatePredicate, processEulaState);
  $transitions.onStart(authenticationPredicate, processAuthentication);
}
