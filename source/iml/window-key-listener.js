// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { Component } from "inferno";

type WindowKeyListenerPropsT = {
  onKeyDownHandler: (e: SyntheticKeyboardEvent<*>) => void
};

class WindowKeyListener extends Component {
  props: WindowKeyListenerPropsT;

  componentDidMount() {
    window.addEventListener("keydown", this.props.onKeyDownHandler);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.props.onKeyDownHandler, false);
  }

  render() {
    return <></>;
  }
}

export default WindowKeyListener;
