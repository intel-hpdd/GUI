// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from "inferno";

type headerT = {
  children?: React$Element<*> | React$Element<*>[]
};

export const Header = ({ children }: headerT) => {
  return <div class="modal-header">{children}</div>;
};

type bodyT = {
  moreClasses?: string[],
  children?: React$Element<*>
};

export const Body = ({ children, moreClasses = [] }: bodyT) => (
  <div className={`modal-body ${moreClasses.join(" ")}`}>{children}</div>
);

type footerT = {
  children?: React$Element<*>[]
};

export const Footer = ({ children }: footerT) => {
  return <div class="modal-footer">{children}</div>;
};

type BackdropT = {
  moreClasses?: string[],
  visible: boolean,
  zIndex?: number
};

export const Backdrop = ({ moreClasses = [], visible, zIndex }: BackdropT) => {
  if (visible === false) return null;

  const style = zIndex != null ? { "z-index": zIndex } : {};
  return <div className={`modal-backdrop fade in ${moreClasses.join(" ")}`} style={style} />;
};

type modalT = {
  children?: React$Element<*> | React$Element<*>[],
  moreClasses?: string[],
  zIndex?: number,
  visible: boolean
};

export const Modal = ({ moreClasses = [], children, visible, zIndex }: modalT) => {
  if (!visible) return null;

  const zIndexStyle = zIndex != null ? { "z-index": zIndex } : {};
  return (
    <div
      style={{ display: "block", ...zIndexStyle }}
      tabindex="-1"
      role="dialog"
      className={`modal fade in ${moreClasses.join(" ")}`}
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">{children}</div>
      </div>
    </div>
  );
};
