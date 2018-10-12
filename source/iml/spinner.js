// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default ({ display }: { display: boolean }) => {
  if (display) return <i class="fa fa-spinner fa-spin" />;
};
