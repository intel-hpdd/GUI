// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from 'inferno';

type Props = {
  isOpen?: boolean,
  toggleOpen?: Function,
  children: React$Element<*>[]
};

export default (props: Props) => {
  if (props.children.length !== 2) throw new Error('DropdownContainer expects two children');

  const [button, ul] = props.children;

  return (
    <div className={`btn-group dropdown ${props.isOpen ? 'open' : ''}`}>
      {Inferno.cloneVNode(button, { onClick: props.toggleOpen })}
      {ul}
    </div>
  );
};
