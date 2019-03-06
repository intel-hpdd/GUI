// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { cloneVNode } from "inferno-clone-vnode";
import { Component } from "inferno";

type PopoverChildProps = {
  children?: React.Node
};

export class PopoverContainer extends Component {
  render() {
    const children = this.props.children.map(c => {
      if (!c.props) {
        return c;
      } else if (c.props.popoverButton) {
        const updatedPopover = cloneVNode(c, {
          onClick: this.props.toggleOpen
        });
        const buttonChildren =
          updatedPopover.children != null
            ? updatedPopover.children.map(c2 => {
                if (c2.props && c2.props.popover)
                  return cloneVNode(c2, {
                    visible: this.props.isOpen
                  });
                else return c2;
              })
            : [];

        updatedPopover.children = buttonChildren;
        return updatedPopover;
      } else if (c.props.popover) {
        return cloneVNode(c, {
          visible: this.props.isOpen
        });
      } else {
        return c;
      }
    });

    return <>{children}</>;
  }
}

export const PopoverTitle = ({ children }: PopoverChildProps) => <h3 class="popover-title">{children}</h3>;

export const PopoverContent = ({ children }: PopoverChildProps) => <div class="popover-content">{children}</div>;

type PopoverProps = {
  children?: React.Node,
  visible?: boolean,
  direction: "top" | "bottom" | "left" | "right"
};

export const Popover = ({ children, visible, direction }: PopoverProps) => {
  if (!visible) return null;

  return (
    <div className={`fade popover ${direction} in`}>
      <div class="arrow" />
      {children}
    </div>
  );
};
