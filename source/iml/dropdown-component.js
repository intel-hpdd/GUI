// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { cloneVNode } from "inferno-clone-vnode";

type Props = {
  isOpen?: boolean,
  extraCss?: string[],
  toggleOpen?: Function,
  children: [React.Element<"button">, React.Element<"ul">]
};

export default (props: Props) => {
  const [button, ul] = props.children;

  return (
    <div
      className={`btn-group dropdown ${props.extraCss ? props.extraCss.join(" ") : ""} ${props.isOpen ? "open" : ""}`}
    >
      {cloneVNode(button, { onClick: props.toggleOpen })}
      {ul}
    </div>
  );
};
