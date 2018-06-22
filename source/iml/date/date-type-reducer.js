// @flow

export const SET_DATE_TYPE = 'SET_DATE_TYPE';

import type { ActionT } from '../store/store-module.js';

type State = {
  isUtc: boolean
};

export default function(state: State = { isUtc: false }, { type, payload }: ActionT): State {
  switch (type) {
    case SET_DATE_TYPE:
      return {
        isUtc: payload
      };
    default:
      return state;
  }
}
