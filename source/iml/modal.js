// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

type headerT = {
  children?: React.ChildrenArray<React.Element<*>>
};

export const Header = ({ children }: headerT) => {
  return <div class="modal-header">{children}</div>;
};

type bodyT = {
  moreClasses?: string[],
  children?: React.ChildrenArray<React.Element<*>>
};

export const Body = ({ children, moreClasses = [] }: bodyT) => (
  <div className={`modal-body ${moreClasses.join(" ")}`}>{children}</div>
);

type footerT = {
  children?: React.ChildrenArray<React.Element<*>>
};

export const Footer = ({ children }: footerT) => {
  return <div class="modal-footer">{children}</div>;
};

export const Backdrop = ({ moreClasses = [], visible, zIndex }: BackdropT) => {
  if (visible === false) return null;

  const style = zIndex != null ? { "z-index": zIndex } : {};
  return <div className={`modal-backdrop fade in ${moreClasses.join(" ")}`} style={style} />;
};

type BackdropT = {
  moreClasses?: string[],
  visible: boolean,
  zIndex?: number
};

type modalT = {
  children?: React.ChildrenArray<React.Element<*>>,
  moreClasses?: string[],
  visible: boolean
};

export const Modal = ({ moreClasses = [], children, visible }: modalT) => {
  if (!visible) return null;

  return (
    <div style={{ display: "block" }} tabindex="-1" role="dialog" className={`modal fade in ${moreClasses.join(" ")}`}>
      <div class="modal-dialog" role="document">
        <div class="modal-content">{children}</div>
      </div>
    </div>
  );
};
