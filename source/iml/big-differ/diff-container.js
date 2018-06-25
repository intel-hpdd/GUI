// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

type Differ = {
  reset: () => void,
  getState: () => { status: string }
};

export const DiffContainerController = class {
  register: (differ: Differ) => number;
  deregister: (differ: Differ) => void;
  reset: () => void;
  noSubmit: () => boolean;
  $onInit() {
    const differs: Array<Differ> = [];

    this.register = differ => differs.push(differ);

    this.deregister = differ => {
      const idx = differs.indexOf(differ);

      if (idx === -1) return;

      differs.splice(idx, 1);
    };

    this.reset = () => differs.forEach(differ => differ.reset());

    this.noSubmit = () => differs.every(differ => differ.getState().status === 'clean');
  }
};

type component = {
  controllerAs: string,
  controller: Class<DiffContainerController>
};

export default (): component => {
  return {
    controllerAs: 'diffContainer',
    controller: DiffContainerController
  };
};
