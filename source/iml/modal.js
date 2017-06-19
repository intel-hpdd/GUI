// @flow

//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

import Inferno from 'inferno';

type headerT = {
  children?: React$Element<*>
};

export const Header = ({ children }: headerT) => {
  return (
    <div class="modal-header">
      {children}
    </div>
  );
};

type bodyT = {
  moreClasses?: string[],
  children?: React$Element<*>
};

export const Body = ({ children, moreClasses = [] }: bodyT) => (
  <div className={`modal-body ${moreClasses.join(' ')}`}>
    {children}
  </div>
);

type footerT = {
  children?: React$Element<*>
};

export const Footer = ({ children }: footerT) => {
  return (
    <div class="modal-footer">
      {children}
    </div>
  );
};

type modalT = {
  children?: React$Element<*>,
  moreClasses?: string[],
  visible: boolean
};

export const Modal = ({ moreClasses = [], children, visible }: modalT) => {
  if (!visible) return;

  return (
    <div
      style={{ display: 'block' }}
      tabindex="-1"
      role="dialog"
      className={`modal fade in ${moreClasses.join(' ')}`}
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};