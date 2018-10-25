// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { cloneVNode } from "inferno-clone-vnode";

type Props = {
  isOpen?: boolean,
  toggleOpen?: Function,
  children?: React.ChildrenArray<React.Element<any>>
};

const twoChildrenError = new Error("DropdownContainer expects two children");

export default (props: Props) => {
  if (props.children) {
    if (props.children.length !== 2) throw twoChildrenError;

    const [button, ul] = props.children;

    return (
      <div className={`btn-group dropdown ${props.isOpen ? "open" : ""}`}>
        {cloneVNode(button, { onClick: props.toggleOpen })}
        {ul}
      </div>
    );
  } else {
    throw twoChildrenError;
  }
};
