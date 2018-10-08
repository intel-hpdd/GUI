// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import produce from "immer";
import { smartSpread } from "../immutability-utils";

import {
  ADD_TREE_ITEMS,
  TOGGLE_COLLECTION_OPEN,
  UPDATE_COLLECTION_OFFSET,
  TOGGLE_ITEM_OPEN,
  RESET_STATE
} from "./tree-types.js";

import type { treeActionsT, treeHashT } from "./tree-types.js";

export default (state: treeHashT = {}, action: treeActionsT): treeHashT =>
  produce(state, (draft: treeHashT) => {
    switch (action.type) {
      case ADD_TREE_ITEMS:
        action.payload.forEach(x => (draft[x.treeId] = x));
        break;
      case TOGGLE_COLLECTION_OPEN: {
        const { id, open } = action.payload;

        if (state[id]) draft[id] = smartSpread(state[id], { open });
        break;
      }
      case UPDATE_COLLECTION_OFFSET: {
        const { id, offset } = action.payload;

        if (state[id]) draft[id] = smartSpread(state[id], { meta: { ...state[id].meta, offset } });
        break;
      }
      case TOGGLE_ITEM_OPEN: {
        const { id, itemId, open } = action.payload;

        if (state[id]) draft[id] = smartSpread(state[id], { opens: { ...state[id].opens, [itemId]: open } });
        break;
      }
      case RESET_STATE:
        draft = {};
        break;
    }
  });
