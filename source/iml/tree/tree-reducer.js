// @flow

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

import * as maybe from '@mfl/maybe';

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
