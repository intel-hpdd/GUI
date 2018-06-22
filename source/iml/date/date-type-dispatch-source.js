// @flow

import { setDateTypeToLocal } from './date-type-actions.js';

import store from '../store/get-store.js';

import { canDispatch } from '../dispatch-source-utils.js';

if (canDispatch())
  store.select('dateType').pull(err => {
    if (err) throw err;
    store.dispatch(setDateTypeToLocal());
  });
