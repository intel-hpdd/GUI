// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

declare class SSEEvent extends Event {
  data: string;
}
declare type SSEEventT = SSEEvent;

type CONNECTING = 0;
type OPEN = 1;
type CLOSED = 2;

type EventSourceConfigurationT = {|
  withCredentials: boolean
|};

declare class EventSource extends EventTarget {
  constructor(url: string, configuration?: EventSourceConfigurationT): EventSource;
  readyState: CONNECTING | OPEN | CLOSED;
  url: string;
  withCredentials: boolean;
  onerror: ?(e: SyntheticEvent<EventSource>) => void;
  onmessage: ?(SSEEventT) => void;
  onopen: ?() => void;
  close: () => void;
}
declare type EventSourceT = EventSource;
