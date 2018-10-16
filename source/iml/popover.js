// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { cloneVNode } from "inferno-clone-vnode";
import { Component } from "inferno";

type PopoverChildProps = {
  children: React$Element<*>[]
};

export class PopoverContainer extends Component {
  render() {
    const children = this.props.children.map(c => {
      if (!c.props) return c;
      else if (c.props.popoverButton)
        return cloneVNode(c, {
          onClick: this.props.toggleOpen
        });
      else if (c.props.popover)
        return cloneVNode(c, {
          visible: this.props.isOpen
        });
      else return c;
    });

    return <span style="position: relative;">{children}</span>;
  }
}

export const PopoverTitle = ({ children }: PopoverChildProps) => <h3 class="popover-title">{children}</h3>;

export const PopoverContent = ({ children }: PopoverChildProps) => <div class="popover-content">{children}</div>;

type PopoverProps = {
  children?: React$Element<*>,
  visible?: boolean,
  direction: "top" | "bottom" | "left" | "right"
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
