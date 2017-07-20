// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from 'inferno';
import Component from 'inferno-component';

type PopoverChildProps = {
  children: React$Element<*>[]
};

export class PopoverContainer extends Component {
  windowListener: ?Function;
  state: { isOpen: boolean };
  constructor(props: PopoverChildProps) {
    super(props);
    this.state = { isOpen: false };
  }
  windowHandler() {
    const { isOpen: previousIsOpen } = this.state;
    const isOpen = !previousIsOpen;

    this.setState({ isOpen });

    if (isOpen || !this.windowListener) return;

    window.removeEventListener('click', this.windowListener, false);
    this.windowListener = null;
  }
  handleClick() {
    if (this.windowListener) return;

    this.windowListener = this.windowHandler.bind(this);
    window.addEventListener('click', this.windowListener);
  }
  render() {
    const children = this.props.children.map(c => {
      if (!c.props) return c;
      else if (c.props.popoverButton)
        return Inferno.cloneVNode(c, {
          onClick: this.handleClick.bind(this)
        });
      else if (c.props.popover)
        return Inferno.cloneVNode(c, {
          visible: this.state.isOpen
        });
      else return c;
    });

    return (
      <span style="position: relative;">
        {children}
      </span>
    );
  }
}

export const PopoverTitle = ({ children }: PopoverChildProps) =>
  <h3 class="popover-title">
    {children}
  </h3>;

export const PopoverContent = ({ children }: PopoverChildProps) =>
  <div class="popover-content">
    {children}
  </div>;

type PopoverProps = {
  children?: React$Element<*>,
  visible?: boolean,
  direction: 'top' | 'bottom' | 'left' | 'right'
};

export const Popover = ({ children, visible, direction }: PopoverProps) => {
  if (!visible) return;

  return (
    <div className={`fade popover ${direction} in`}>
      <div class="arrow" />
      {children}
    </div>
  );
};
