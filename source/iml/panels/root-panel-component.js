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

import global from '../global.js';

const overlay = global.document.createElement('div');
overlay.className = 'overlay';

const SLIDER_WIDTH_PX = 3;
const MAX_SIDE_PERCENTAGE = 35;

export function Controller($element: HTMLElement[]) {
  'ngInject';
  const listeners = [];

  this.register = listener => listeners.push(listener);

  this.deregister = listener => {
    const idx = listeners.indexOf(listener);

    if (idx === -1) return;

    listeners.splice(idx, 1);
  };

  const el = $element[0];

  let running = false;

  this.onChange = (x: number) => {
    if (running) return;

    running = true;

    const overlayWidthPx = overlay.getBoundingClientRect().width -
      SLIDER_WIDTH_PX;

    x = Math.max(x, 0);
    let sideWidthPercentage = x / overlayWidthPx * 100;
    sideWidthPercentage = Math.min(MAX_SIDE_PERCENTAGE, sideWidthPercentage);

    if (sideWidthPercentage === MAX_SIDE_PERCENTAGE)
      x = overlayWidthPx * (sideWidthPercentage / 100);

    global.requestAnimationFrame(() => {
      listeners.forEach(l =>
        l({
          sideWidthPx: x,
          sideWidthPercentage,
          mainWidthPercentage: 100 - sideWidthPercentage,
          mainWidthPx: overlayWidthPx - x
        }));

      running = false;
    });
  };

  this.close = () => {
    this.setActive();
    this.onChange(0);
    this.setInactive();
  };

  this.open = () => {
    this.setActive();
    this.onChange(200);
    this.setInactive();
  };

  this.setActive = () => {
    el.classList.add('active');
    global.document.body.appendChild(overlay);
  };

  this.setInactive = () => {
    el.classList.remove('active');
    global.document.body.removeChild(overlay);
  };
}

export default {
  controller: Controller
};
