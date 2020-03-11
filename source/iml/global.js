// Copyright (c) 2020 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

try {
  // Assign directly to window due to https://github.com/rustwasm/wasm-bindgen/pull/1995
  // eslint-disable-next-line no-undef, camelcase
  window.wasm_bindgen = wasm_bindgen;
} catch (e) {
  window.wasm_bindgen = {};
}

export default window;
