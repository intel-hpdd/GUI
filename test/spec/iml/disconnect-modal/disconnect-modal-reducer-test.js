// @flow

import disconnectModalReducer, {
  SET_DISCONNECT_REALTIME,
  SET_DISCONNECT_SSE,
  SET_CONNECT_REALTIME,
  SET_CONNECT_SSE
} from "../../../../source/iml/disconnect-modal/disconnect-modal-reducer.js";

describe("disconnect modal reducer", () => {
  it("should handle realtime disconnecting", () => {
    const result = disconnectModalReducer(
      { sseDisconnected: false, realtimeDisconnected: false },
      { type: SET_DISCONNECT_REALTIME, payload: {} }
    );
    expect(result).toEqual({ sseDisconnected: false, realtimeDisconnected: true });
  });

  it("should handle sse disconnecting", () => {
    const result = disconnectModalReducer(
      { sseDisconnected: false, realtimeDisconnected: false },
      { type: SET_DISCONNECT_SSE, payload: {} }
    );
    expect(result).toEqual({ sseDisconnected: true, realtimeDisconnected: false });
  });

  it("should handle realtime connecting", () => {
    const result = disconnectModalReducer(
      { sseDisconnected: false, realtimeDisconnected: false },
      { type: SET_CONNECT_REALTIME, payload: {} }
    );
    expect(result).toEqual({ sseDisconnected: false, realtimeDisconnected: false });
  });

  it("should handle sse connecting", () => {
    const result = disconnectModalReducer(
      { sseDisconnected: false, realtimeDisconnected: false },
      { type: SET_CONNECT_SSE, payload: {} }
    );
    expect(result).toEqual({ sseDisconnected: false, realtimeDisconnected: false });
  });
});
