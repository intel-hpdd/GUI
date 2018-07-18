// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as maybe from '@iml/maybe';

import {
  ADD_TREE_ITEMS,
  TOGGLE_COLLECTION_OPEN,
  UPDATE_COLLECTION_OFFSET,
  TOGGLE_ITEM_OPEN,
  RESET_STATE
} from './tree-types.js';

import type { treeActionsT, treeHashT } from './tree-types.js';

function updateItem(state, id, fn) {
  const nextStateM = maybe.map(
    x => ({
      ...state,
      [id]: {
        ...x,
        ...fn(x)
      }
    }),
    maybe.of(state[id])
  );

  return maybe.withDefault(() => state, nextStateM);
}

export default (state: treeHashT = {}, action: treeActionsT): treeHashT => {
  switch (action.type) {
    case ADD_TREE_ITEMS:
      return action.payload.reduce((state, x) => {
        return {
          ...state,
          [x.treeId]: x
        };
      }, state);
    case TOGGLE_COLLECTION_OPEN: {
      const { id, open } = action.payload;

      // eslint-disable-next-line no-unused-vars
      return updateItem(state, id, (...rest) => ({ open }));
    }
    case UPDATE_COLLECTION_OFFSET: {
      const { id, offset } = action.payload;

      return updateItem(state, id, x => ({
        meta: {
          ...x.meta,
          offset
        }
      }));
    }
    case TOGGLE_ITEM_OPEN: {
      const { id, itemId, open } = action.payload;

      return updateItem(state, id, x => ({
        opens: {
          ...x.opens,
          [itemId]: open
        }
      }));
    }
    case RESET_STATE:
      return {};
    default:
      return state;
  }
};
