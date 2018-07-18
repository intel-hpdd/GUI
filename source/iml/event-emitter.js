// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

type argsToVoid = (...rest: any[]) => void;

declare class EventEmitter {
  constructor(): void;
  emit(event: string, ...args: Array<any>): boolean;
  on(event: string, listener: argsToVoid): EventEmitter;
  once(event: string, listener: argsToVoid): EventEmitter;
  removeAllListeners(event?: string): EventEmitter;
}

export type EventEmitterT = EventEmitter;

import highland from 'highland';

const EE: typeof EventEmitter = Object.getPrototypeOf(Object.getPrototypeOf((highland(): any))).constructor;

export default EE;
