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

    this.noSubmit = () =>
      differs.every(differ => differ.getState().status === 'clean');
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
