//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const capitalizeStr = (str: sttring): string => str[0].toUpperCase() + str.slice(1);

export function capitalize(words, all) {
  if (typeof words !== "string") return words;

  if (all)
    words = words
      .trim()
      .split(/\s+/)
      .map(capitalizeStr)
      .join(" ");
  else words = capitalizeStr(words);

  return words;
}

export default function capitalizeFilter() {
  "ngInject";

  return capitalize;
}
