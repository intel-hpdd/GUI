// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Immutable from "seamless-immutable";

export const MODAL_STACK_ADD_MODAL: "MODAL_STACK_ADD_MODAL" = "MODAL_STACK_ADD_MODAL";
export const MODAL_STACK_REMOVE_MODAL: "MODAL_STACK_REMOVE_MODAL" = "MODAL_STACK_REMOVE_MODAL";

export type AddModalT = {|
  type: typeof MODAL_STACK_ADD_MODAL,
  payload: string
|};

export type RemoveModalT = {|
  type: typeof MODAL_STACK_REMOVE_MODAL,
  payload: string
|};

type ModalStackT = AddModalT | RemoveModalT;

type stateT = Array<string>;

export default function(state: stateT = [], action: ModalStackT): stateT {
  switch (action.type) {
    case MODAL_STACK_ADD_MODAL:
      if (state.some(x => x === action.payload) === false) return Immutable([action.payload, ...state]);
      else return Immutable(state);
    case MODAL_STACK_REMOVE_MODAL:
      return Immutable(state.filter(x => x !== action.payload));
    default:
      return state;
  }
}
