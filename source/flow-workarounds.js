// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

// Used for working with exact types in which an object is being spread. Currently, flow is not
// able to read the types correctly for a spread object over an exact type.
// https://github.com/facebook/flow/issues/2405
export type Exact<T> = T & $Shape<T>;
