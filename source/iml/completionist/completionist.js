// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const KEY_PRESS = 'KEY_PRESS';
export const VALUE = 'VALUE';
export const VALUES = 'VALUES';

export const CompletionistCtrl = class {
  evMap: Object = {};
  completer: (params: { value: string, cursorPosition: number }) => Array<string>;
  register(evName: string, listener: Function): void {
    this.evMap[evName] = this.evMap[evName] || [];
    this.evMap[evName].push(listener);
  }
  deregister(evName: string, listener: Function): void {
    const listeners = this.evMap[evName];

    if (!listeners) return;

    this.evMap[evName] = listeners.filter(x => x !== listener);
  }
  emit(evName: string, data: any): void {
    const listeners = this.evMap[evName];

    if (!listeners) return;

    listeners.forEach(x => x(data));
  }
  parse(value: string, cursorPosition: number): void {
    const result = this.completer({
      value,
      cursorPosition
    });

    this.emit(VALUES, result);
  }
};

export default {
  bindings: {
    completer: '&'
  },
  controller: CompletionistCtrl
};
