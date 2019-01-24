// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { Modal, Body, Backdrop } from "../modal.js";

const DisconnectModal = () => {
  return (
    <>
      <Modal visible={true} moreClasses={["disconnect-modal"]}>
        <Body>
          <h3>
            Disconnected From Server, Retrying. <i class="fa fa-spinner fa-spin fa-lg" />
          </h3>
        </Body>
      </Modal>
      <Backdrop visible={true} />
    </>
  );
};
export default DisconnectModal;
