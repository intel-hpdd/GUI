// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { Component } from "inferno";
import serversToApiObjects from "./servers-to-api-objects.js";
import getTestHostStream from "./get-test-host-stream.js";
import { getTestHostState } from "./server-transforms.js";
import getStore from "../store/get-store.js";
import { SHOW_EXCEPTION_MODAL_ACTION } from "../exception/exception-modal-reducer.js";
import {
  ADD_SERVER_MODAL_UPDATE_TEST_HOST,
  ADD_SERVER_MODAL_UPDATE_SERVERS,
  ADD_SERVER_MODAL_SET_RESET_TEST_HOSTS,
  type AddServerModalPayloadT
} from "./add-server-modal-reducer.js";
import hostlistFilter from "./hostlist-filter.js";
import connectToStore from "../connect-to-store.js";

import { getDeployedServers, type HostT, type TestHostT, HOST_STATE_UNCONFIGURED } from "./server-module.js";
import { type AuthTypesT } from "./server-authorization-component.js";
import { type HighlandStreamT } from "highland";

type TestHostModalComponentPropsT = {
  WrappedComponent: React.AbstractComponent<*>,
  addServerModal: AddServerModalPayloadT
};

class TestHostModalComponent extends Component {
  props: TestHostModalComponentPropsT;
  testHost$: ?HighlandStreamT<*>;
  servers$: ?HighlandStreamT<*>;

  endTestHost$ = () => {
    if (this.testHost$ != null) this.testHost$.end();
    this.testHost$ = null;
    getStore.dispatch({
      type: ADD_SERVER_MODAL_SET_RESET_TEST_HOSTS,
      payload: {
        resetTestHosts: false
      }
    });
  };

  endServers$ = () => {
    if (this.servers$ != null) this.servers$.end();
    this.servers$ = null;
  };

  componentWillUnmount = () => {
    this.endTestHost$();
    this.endServers$();
  };

  testHosts = ({
    addresses,
    authType,
    rootPassword,
    privateKey,
    privateKeyPassphrase,
    servers,
    deployedServers
  }: {
    addresses: string[],
    authType: AuthTypesT,
    rootPassword: string,
    privateKey: string,
    privateKeyPassphrase: string,
    servers: HostT[],
    deployedServers: string[]
  }) => {
    const objects = serversToApiObjects({
      addresses,
      auth_type: authType,
      root_password: rootPassword,
      private_key: privateKey,
      private_key_passphrase: privateKeyPassphrase
    });

    this.testHost$ = getTestHostStream({ objects })
      .through(getTestHostState(servers, deployedServers))
      .stopOnError(e => {
        getStore.dispatch({
          type: SHOW_EXCEPTION_MODAL_ACTION,
          payload: e
        });
      })
      .each(({ objects }: { objects: TestHostT[] }) => {
        const testHostsStatus = hostlistFilter()
          .setHosts(objects)
          .compute();

        const deployableAddresses: string[] =
          testHostsStatus
            .map(x => ((!x.deployed && x.valid) || (x.valid && x.state === HOST_STATE_UNCONFIGURED) ? x.address : ""))
            .filter(x => x !== "") || [];

        getStore.dispatch({
          type: ADD_SERVER_MODAL_UPDATE_TEST_HOST,
          payload: {
            testHostsStatus,
            deployableAddresses,
            testingHosts: false
          }
        });
      });

    getStore.dispatch({
      type: ADD_SERVER_MODAL_UPDATE_TEST_HOST,
      payload: {
        testHostsStatus: [],
        deployableAddresses: [],
        testingHosts: true
      }
    });
  };

  componentDidMount() {
    this.servers$ = getStore.select("server").each((servers: HostT[]) => {
      getStore.dispatch({
        type: ADD_SERVER_MODAL_UPDATE_SERVERS,
        payload: {
          servers,
          deployedServers: getDeployedServers(servers)
        }
      });
    });
  }

  render() {
    if (this.props.addServerModal.resetTestHosts === true) {
      this.endTestHost$();

      if (this.props.addServerModal.addresses.length > 0 && this.props.addServerModal.canTestHosts === true)
        this.testHosts({ ...this.props.addServerModal });
    }
    const WrappedComponent = this.props.WrappedComponent;

    return <WrappedComponent {...this.props.addServerModal} {...this.props} />;
  }
}

export default (WrappedComponent: React.AbstractComponent<AddServerModalPayloadT>) => {
  const ConnectedTestHostModal = connectToStore("addServerModal", TestHostModalComponent);
  return () => <ConnectedTestHostModal WrappedComponent={WrappedComponent} />;
};
