// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { HELP_TEXT } from "./environment.js";

export default function help($sce: Object) {
  "ngInject";
  const trusted = {};

  function addToTrusted(key) {
    trusted[key] = $sce.trustAsHtml(HELP_TEXT[key]);

    return trusted[key];
  }

  return {
    get: function get(key: string) {
      if (!HELP_TEXT[key]) throw new Error(`Key ${key} is not in help text!`);

      return trusted[key] || addToTrusted(key);
    }
  };
}

export const getHelpContent = (key: string) => {
  if (!HELP_TEXT[key]) throw new Error(`Key ${key} is not in help text!`);
  return { __html: HELP_TEXT[key] };
};
