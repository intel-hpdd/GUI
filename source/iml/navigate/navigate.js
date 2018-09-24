// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export type Navigate = (part?: string) => string;

export function navigateFactory($window: typeof window, UI_ROOT: string) {
  "ngInject";

  return (part?: string) => {
    if (part == null) part = "";

    $window.location.href = UI_ROOT + part;
  };
}
