// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from "inferno";
import Tooltip from "./tooltip.js";
import { HELP_TEXT } from "./environment.js";

import type { directionsT } from "./tooltip.js";

type helpTooltipT = {
  helpKey?: string,
  direction: directionsT,
  moreClasses?: string[]
};

export default ({ helpKey, direction, moreClasses }: helpTooltipT) => {
  if (!helpKey) return;

  return <Tooltip message={HELP_TEXT[helpKey]} direction={direction} moreClasses={moreClasses} />;
};
