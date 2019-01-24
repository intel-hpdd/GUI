// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Immutable from "seamless-immutable";

export const SET_DISCONNECT_REALTIME: "SET_DISCONNECT_REALTIME" = "SET_DISCONNECT_REALTIME";
export const SET_CONNECT_REALTIME: "SET_CONNECT_REALTIME" = "SET_CONNECT_REALTIME";
export const SET_DISCONNECT_SSE: "SET_DISCONNECT_SSE" = "SET_DISCONNECT_SSE";
export const SET_CONNECT_SSE: "SET_CONNECT_SSE" = "SET_CONNECT_SSE";

type SetDisconnectRealtimeActionT = {|
  type: typeof SET_DISCONNECT_REALTIME,
  payload: {||}
|};

type SetConnectRealtimeActionT = {|
  type: typeof SET_CONNECT_REALTIME,
  payload: {||}
|};

type SetDisconnectSseActionT = {|
  type: typeof SET_DISCONNECT_SSE,
  payload: {||}
|};

type SetConnectSseActionT = {|
  type: typeof SET_CONNECT_SSE,
  payload: {||}
|};

type DisconnectModalActionsT =
  | SetDisconnectRealtimeActionT
  | SetConnectRealtimeActionT
  | SetDisconnectSseActionT
  | SetConnectSseActionT;

export type DisconnectModalStateT = {|
  sseDisconnected: boolean,
  realtimeDisconnected: boolean
|};

export default function(
  state: DisconnectModalStateT = Immutable({ sseDisconnected: false, realtimeDisconnected: false }),
  action: DisconnectModalActionsT
): DisconnectModalStateT {
  switch (action.type) {
    case SET_DISCONNECT_REALTIME:
      return Immutable.merge(state, { realtimeDisconnected: true });
    case SET_CONNECT_REALTIME:
      return Immutable.merge(state, { realtimeDisconnected: false });
    case SET_DISCONNECT_SSE:
      return Immutable.merge(state, { sseDisconnected: true });
    case SET_CONNECT_SSE:
      return Immutable.merge(state, { sseDisconnected: false });
    default:
      return state;
  }
}
