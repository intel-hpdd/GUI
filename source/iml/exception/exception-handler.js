//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { Component, linkEvent } from "inferno";
import { Modal, Header, Body, Footer, Backdrop } from "../modal.js";
import global from "../global.js";

const regex = /^.+\:\d+\:\d+.*$/;

export default $provide => {
  "ngInject";
  $provide.decorator("$exceptionHandler", function($injector, windowUnload, $delegate) {
    "ngInject";
    let triggered;
    const cache = {};

    return function handleException(exception, cause) {
      //Always hit the delegate.
      $delegate(exception, cause);

      if (triggered || windowUnload.unloading) return;

      triggered = true;

      if (!exception.statusCode && stackTraceContainsLineNumbers(exception))
        sendStackTraceToSrcmapReverseService(exception);

      // Lazy Load to avoid a $rootScope circular dependency.
      const exceptionModal = get("exceptionModal");

      exceptionModal();
    };

    function get(serviceName) {
      return cache[serviceName] || (cache[serviceName] = $injector.get(serviceName));
    }
  });
};

type ExceptionModalProps = {
  exception: Error
};

export class ExceptionModalComponent extends Component {
  constructor(props: ExceptionModalProps) {
    super(props);
  }

  componentDidMount() {
    if (!this.props.exception.statusCode && stackTraceContainsLineNumbers(this.props.exception))
      sendStackTraceToSrcmapReverseService(this.props.exception);
  }

  reload(global) {
    global.document.location.reload(true);
  }

  render() {
    return (
      <>
        <Modal visible={true} moreClasses={["exception-modal"]} zIndex={2000}>
          <Header>
            <h3>
              <i class="fa fa-exclamation-triangle" />
              Encountered An Error
            </h3>
          </Header>
          <Body moreClasses={["text-center"]}>
            <p>
              An unexpected error has occurred. <br />
              Please collect iml-diagnostics and send to support.
            </p>
          </Body>
          <Footer>
            <button onClick={linkEvent(global, this.reload)} className="btn btn-large btn-block" type="button">
              <i class="fa fa-refresh" /> Reload
            </button>
          </Footer>
        </Modal>
        <Backdrop visible={true} moreClasses={["exception-modal-backdrop"]} zIndex={1999} />
      </>
    );
  }
}

function stackTraceContainsLineNumbers(stackTrace) {
  return stackTrace.stack.split("\n").some(function verifyStackTraceContainsLineNumbers(val) {
    const match = val.trim().match(regex);
    return match == null ? false : match.length > 0;
  });
}

function sendStackTraceToSrcmapReverseService(exception) {
  global.fetch("/iml-srcmap-reverse", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify({
      trace: exception.stack
    })
  });
}
