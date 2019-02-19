// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Tooltip from "./tooltip.js";
import { HELP_TEXT } from "./environment.js";

import type { directionsT, sizesT } from "./tooltip.js";

type helpTooltipT = {
  helpKey?: string,
  direction: directionsT,
  size?: sizesT,
  moreClasses?: string[]
};

export default ({ helpKey, direction, size, moreClasses }: helpTooltipT) => {
  if (!helpKey) return null;

  return <Tooltip message={HELP_TEXT[helpKey]} direction={direction} size={size} moreClasses={moreClasses} />;
};
