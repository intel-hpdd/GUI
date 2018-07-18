//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default function roundFilter() {
  'ngInject';
  return function rounder(value, places) {
    // Return value if number is not as expected.
    if (isNaN(parseFloat(value)) || !isFinite(value)) return value;
    // If places is not provided, just round the value to nearest whole number.
    if (places == null) return Math.round(value);

    const shiftTo = Math.pow(10, places);

    // Shift
    value = Math.round(value * shiftTo);

    // Shift back
    return value / shiftTo;
  };
}
