// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from 'inferno';

type headerT = {
  children?: React$Element<*>
};

export const Header = ({ children }: headerT) => {
  return <div class="modal-header">{children}</div>;
};

type bodyT = {
  moreClasses?: string[],
  children?: React$Element<*>
};

export const Body = ({ children, moreClasses = [] }: bodyT) => (
  <div className={`modal-body ${moreClasses.join(' ')}`}>{children}</div>
);

type footerT = {
  children?: React$Element<*>
};

export const Footer = ({ children }: footerT) => {
  return <div class="modal-footer">{children}</div>;
};

type modalT = {
  children?: React$Element<*>,
  moreClasses?: string[],
  visible: boolean
};

export const Modal = ({ moreClasses = [], children, visible }: modalT) => {
  if (!visible) return;

  return (
    <div style={{ display: 'block' }} tabindex="-1" role="dialog" className={`modal fade in ${moreClasses.join(' ')}`}>
      <div class="modal-dialog" role="document">
        <div class="modal-content">{children}</div>
      </div>
    </div>
  );
};
