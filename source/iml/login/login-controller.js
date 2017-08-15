// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { Navigate } from '../navigate/navigate.js';

import { getCSRFToken } from '../auth/authorization.js';
import { ALLOW_ANONYMOUS_READ } from '../environment.js';
import global from '../global.js';

const getHeaders = () => ({
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=UTF-8',
  ...getCSRFToken()
});

export default function LoginCtrl(navigate: Navigate) {
  'ngInject';

  this.submitLogin = () => {
    this.inProgress = true;
    this.validate = global
      .fetch('/api/session/', {
        method: 'post',
        headers: getHeaders(),
        credentials: 'same-origin',
        body: JSON.stringify({
          username: this.username,
          password: this.password
        })
      })
      .then(response => {
        if (response.status !== 201) {
          return response.json().then(reason => Promise.reject(reason));
        } else {
          this.inProgress = false;
          navigate();
        }
      })
      .catch(reason => {
        this.inProgress = false;
        return Promise.reject({ data: reason });
      });
  };

  this.ALLOW_ANONYMOUS_READ = ALLOW_ANONYMOUS_READ;
  this.goToIndex = navigate;
}
