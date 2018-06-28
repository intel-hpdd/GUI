// @flow

export const SET_TIME_ZONE = 'SET_TIME_ZONE';

import type { ActionT } from '../store/store-module.js';

export type TzPickerProps = {
  isUtc: boolean
};

export default function(state: TzPickerProps = { isUtc: false }, { type, payload }: ActionT): TzPickerProps {
  switch (type) {
    case SET_TIME_ZONE:
      return {
        isUtc: payload
      };
    default:
      return state;
  }
}
