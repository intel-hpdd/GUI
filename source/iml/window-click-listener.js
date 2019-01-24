// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { Component } from "inferno";
import { cloneChildren } from "./inferno-utils.js";

type WindowClickListenerPropsT = {|
  forceOpen?: boolean,
  onOpenChanged?: (isOpen: boolean) => void,
  children?: React.ChildrenArray<React.Element<*>>
|};
export default class WindowClickListener extends Component {
  windowListener: ?Function;
  state: { isOpen: boolean } = { isOpen: false };
  props: WindowClickListenerPropsT;

  componentWillUnmount() {
    if (this.windowListener) window.removeEventListener("click", this.windowListener, false);
  }
  componentDidUpdate(prevProps: WindowClickListenerPropsT) {
    if (prevProps.forceOpen !== this.props.forceOpen)
      if (this.props.forceOpen === true && this.state.isOpen === false) {
        this.toggleOpen();
        this.windowHandler();
      }
  }
  windowHandler() {
    const { isOpen: previousIsOpen } = this.state;
    const isOpen = !previousIsOpen;

    this.setState({ isOpen });

    if (this.props.onOpenChanged != null) this.props.onOpenChanged(isOpen);

    if (isOpen || !this.windowListener) return;

    window.removeEventListener("click", this.windowListener, false);
    this.windowListener = null;
  }
  toggleOpen() {
    if (this.windowListener) return;

    this.windowListener = this.windowHandler.bind(this);
    window.addEventListener("click", this.windowListener);
  }
  render() {
    if (Array.isArray(this.props.children))
      throw new Error(`WindowClickListener expects a single child, got ${this.props.children.length} children`);

    return cloneChildren(this.props.children, () => ({
      isOpen: this.state.isOpen,
      toggleOpen: this.toggleOpen.bind(this)
    }))[0];
  }
}
