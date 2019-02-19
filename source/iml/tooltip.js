// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export type directionsT = "left" | "right" | "top" | "bottom";

export type sizesT = "" | "xsmall" | "small" | "medium" | "large";

type TooltipProps = {
  message?: string,
  direction: directionsT,
  size?: sizesT,
  moreClasses?: string[],
  children?: React$Element<*> | React$Element<*>[]
};

export default ({ message, direction, size = "", moreClasses = [], children }: TooltipProps) => {
  if (!message && !children) return null;

  const tooltipMessage = message ? <span>{message}</span> : children;

  return (
    <div className={`tooltip inferno-tt ${direction} ${size} ${moreClasses.join(" ")}`}>
      <div class="tooltip-arrow" />
      <div class="tooltip-inner">{tooltipMessage}</div>
    </div>
  );
};
