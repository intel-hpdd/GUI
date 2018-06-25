// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from 'inferno';

export type directionsT = 'left' | 'right' | 'top' | 'bottom';

export type sizesT = '' | 'xsmall' | 'small' | 'medium' | 'large';

type TooltipProps = {
  message?: string,
  direction: directionsT,
  size?: sizesT,
  moreClasses?: string[]
};

export default ({ message, direction, size = '', moreClasses = [] }: TooltipProps) => {
  if (!message) return;

  return (
    <div className={`tooltip inferno-tt ${direction} ${size} ${moreClasses.join(' ')}`}>
      <div class="tooltip-arrow" />
      <div class="tooltip-inner">
        <span>{message}</span>
      </div>
    </div>
  );
};
