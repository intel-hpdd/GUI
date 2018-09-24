// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import global from "../global.js";

import { querySelector } from "../dom-utils.js";

const body = querySelector(global.document, "body");
const overlay = global.document.createElement("div");
overlay.className = "overlay";

const SLIDER_WIDTH_PX = 3;
const MAX_SIDE_PERCENTAGE = 35;

export function Controller($element: HTMLElement[]) {
  "ngInject";
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

    const overlayWidthPx = overlay.getBoundingClientRect().width - SLIDER_WIDTH_PX;

    x = Math.max(x, 0);
    let sideWidthPercentage = (x / overlayWidthPx) * 100;
    sideWidthPercentage = Math.min(MAX_SIDE_PERCENTAGE, sideWidthPercentage);

    if (sideWidthPercentage === MAX_SIDE_PERCENTAGE) x = overlayWidthPx * (sideWidthPercentage / 100);

    global.requestAnimationFrame(() => {
      global.dispatchEvent(new Event("resize"));
      listeners.forEach(l =>
        l({
          sideWidthPx: x,
          sideWidthPercentage,
          mainWidthPercentage: 100 - sideWidthPercentage,
          mainWidthPx: overlayWidthPx - x
        })
      );

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
    el.classList.add("active");
    body.appendChild(overlay);
  };

  this.setInactive = () => {
    el.classList.remove("active");
    body.removeChild(overlay);
  };
}

export default {
  controller: Controller
};
