// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { Component } from "inferno";
import HelpTooltipComponent from "../help-tooltip.js";
import Tooltip from "../tooltip.js";
import { ADD_SERVER_MODAL_SET_AUTH_DATA } from "./add-server-modal-reducer.js";
import getStore from "../store/get-store.js";
import connectToStore from "../connect-to-store.js";
import debounce from "@iml/debounce";

export const AUTHORIZATION_TYPES: {
  EXISTING_KEYS: "existing_keys",
  ROOT_PASSWORD: "root_password",
  ANOTHER_KEY: "another_key"
} = {
  EXISTING_KEYS: "existing_keys",
  ROOT_PASSWORD: "root_password",
  ANOTHER_KEY: "another_key"
};

const HELP_KEYS = {
  EXISTING_KEYS: "existing_keys_tooltip",
  ROOT_PASSWORD: "root_password_tooltip",
  ANOTHER_KEY: "another_key_tooltip"
};

export type AuthTypesT = "existing_keys" | "root_password" | "another_key";
type AuthTypeLabelsT = "Existing Key" | "Root Password" | "Another Key";

const getLabelByAuthType = (authType: string): AuthTypeLabelsT => {
  let label = "";
  switch (authType) {
    case AUTHORIZATION_TYPES.EXISTING_KEYS:
      label = "Existing Key";
      break;
    case AUTHORIZATION_TYPES.ROOT_PASSWORD:
      label = "Root Password";
      break;
    case AUTHORIZATION_TYPES.ANOTHER_KEY:
      label = "Another Key";
      break;
    default:
      label = "Existing Key";
  }

  return label;
};

type AuthorizationTypeButtonT = {
  active: boolean,
  helpKey: "existing_keys_tooltip" | "root_password_tooltip" | "another_key_tooltip",
  authType: AuthTypesT
};

const AuthorizationTypeButton = ({ active, helpKey, authType }: AuthorizationTypeButtonT) => {
  return (
    <label
      className={`btn btn-primary tooltip-container tooltip-hover${active ? " active" : ""}`}
      onClick={onSelectAuthentication}
      data-auth-type={authType}
    >
      {getLabelByAuthType(authType)}
      <i class="fa fa-question-circle" />
      <HelpTooltipComponent size={"large"} helpKey={helpKey} direction="top" />
    </label>
  );
};

const onSelectAuthentication = (e: SyntheticInputEvent<HTMLLabelElement>) => {
  getStore.dispatch({
    type: ADD_SERVER_MODAL_SET_AUTH_DATA,
    payload: {
      authType: e.currentTarget.getAttribute("data-auth-type")
    }
  });
};

const TooltipValidation = ({ isValid, children }: { isValid: boolean, children: React.Element<*> }) => {
  if (isValid) return null;

  return (
    <Tooltip moreClasses={["error-tooltip", "in"]} direction="bottom">
      {children}
    </Tooltip>
  );
};

type RootPasswordProps = {
  visible: boolean,
  rootPassword: string
};

type RootPasswordState = {
  isValid: boolean,
  rootPassword: string
};

class RootPasswordComponent extends Component {
  props: RootPasswordProps;
  state: RootPasswordState;

  constructor(props) {
    super(props);

    this.state = {
      isValid: false,
      rootPassword: this.props.rootPassword
    };
  }

  handlePasswordChange = (val: string) => {
    const isValid = val.length > 0;
    this.setState({
      isValid
    });

    getStore.dispatch({
      type: ADD_SERVER_MODAL_SET_AUTH_DATA,
      payload: {
        rootPassword: val
      }
    });
  };

  debounceUpdatePassword = debounce((this.handlePasswordChange: any), 1000);

  render() {
    if (!this.props.visible) return null;

    return (
      <div className={`root-password form-group choice${this.state.isValid === false ? " has-error" : ""}`}>
        <label>
          Root Password
          <a class="item-help tooltip-container tooltip-hover">
            <i class="fa fa-question-circle" />
            <HelpTooltipComponent size={"large"} direction="right" helpKey="root_password_input_tooltip" />
          </a>
        </label>
        <input
          type="password"
          value={this.state.rootPassword}
          name="root_password"
          class="form-control"
          placeholder="Root Password"
          onInput={e => {
            this.setState({ rootPassword: e.currentTarget.value });
            this.debounceUpdatePassword(e.currentTarget.value);
          }}
          required
        />
        <TooltipValidation isValid={this.state.isValid}>
          <span>Root Password is required.</span>
        </TooltipValidation>
      </div>
    );
  }
}

type AnotherKeyProps = {
  visible: boolean,
  privateKey: string,
  privateKeyPassphrase: string
};

type AnotherKeyState = {
  privateKeyIsValid: boolean,
  privateKey: string,
  privateKeyPassphrase: string
};

class AnotherKeyComponent extends Component {
  props: AnotherKeyProps;
  state: AnotherKeyState;

  constructor(props) {
    super(props);

    this.state = {
      privateKeyIsValid: false,
      privateKey: this.props.privateKey,
      privateKeyPassphrase: this.props.privateKeyPassphrase
    };
  }

  onPrivateKeyChange = (privateKey: string) => {
    const privateKeyIsValid = privateKey.length > 0;
    this.setState({
      privateKeyIsValid
    });

    getStore.dispatch({
      type: ADD_SERVER_MODAL_SET_AUTH_DATA,
      payload: {
        privateKey
      }
    });
  };

  onPrivateKeyPassphraseChange = (privateKeyPassphrase: string) => {
    getStore.dispatch({
      type: ADD_SERVER_MODAL_SET_AUTH_DATA,
      payload: {
        privateKeyPassphrase
      }
    });
  };

  debounceUpdateKey = debounce((this.onPrivateKeyChange: any), 1000);
  debounceUpdateKeyPassphrase = debounce((this.onPrivateKeyPassphraseChange: any), 1000);

  render() {
    if (!this.props.visible) return null;

    return (
      <div class="another-key choice">
        <div className={`form-group${this.state.privateKeyIsValid === false ? " has-error" : ""}`}>
          <label>
            Private Key
            <a class="item-help tooltip-container tooltip-hover">
              <i class="fa fa-question-circle" />
              <HelpTooltipComponent size="large" direction="right" helpKey="private_key_textarea_tooltip" />
            </a>
          </label>
          <textarea
            class="form-control"
            rows="3"
            name="private_key"
            onInput={e => {
              this.setState({ privateKey: e.currentTarget.value });
              this.debounceUpdateKey(e.currentTarget.value);
            }}
            value={this.state.privateKey}
            required
          />
          <TooltipValidation isValid={this.state.privateKeyIsValid}>
            <span>Private Key is required.</span>
          </TooltipValidation>
        </div>
        <div class="form-group">
          <label class="private-key-label">
            Private Key Passphrase
            <a class="item-help tooltip-container tooltip-hover">
              <i class="fa fa-question-circle" />
              <HelpTooltipComponent size="large" direction="right" helpKey="private_key_input_tooltip" />
            </a>
          </label>
          <input
            type="password"
            name="private_key_passphrase"
            class="form-control"
            placeholder="Private Key Passphrase"
            value={this.state.privateKeyPassphrase}
            onInput={e => {
              this.setState({ privateKeyPassphrase: e.currentTarget.value });
              this.debounceUpdateKeyPassphrase(e.currentTarget.value);
            }}
          />
        </div>
      </div>
    );
  }
}

type ServerAuthorizationProps = {
  authType: AuthTypesT,
  rootPassword: string,
  privateKey: string,
  privateKeyPassphrase: string
};

const ServerAuthorizationComponent = connectToStore(
  "addServerModal",
  ({ authType, rootPassword, privateKey, privateKeyPassphrase }: ServerAuthorizationProps) => {
    return (
      <>
        <div class="form-group">
          <div>
            <label>
              SSH Authentication
              <a class="item-help tooltip-container tooltip-hover">
                <i class="fa fa-question-circle" />
                <HelpTooltipComponent size={"large"} helpKey="ssh_authentication_tooltip" direction="top" />
              </a>
            </label>
          </div>
          <div class="btn-group ssh-auth-choices">
            <AuthorizationTypeButton
              authType={AUTHORIZATION_TYPES.EXISTING_KEYS}
              active={authType === AUTHORIZATION_TYPES.EXISTING_KEYS}
              helpKey={HELP_KEYS.EXISTING_KEYS}
            />
            <AuthorizationTypeButton
              authType={AUTHORIZATION_TYPES.ROOT_PASSWORD}
              active={authType === AUTHORIZATION_TYPES.ROOT_PASSWORD}
              helpKey={HELP_KEYS.ROOT_PASSWORD}
            />
            <AuthorizationTypeButton
              authType={AUTHORIZATION_TYPES.ANOTHER_KEY}
              active={authType === AUTHORIZATION_TYPES.ANOTHER_KEY}
              helpKey={HELP_KEYS.ANOTHER_KEY}
            />
          </div>
        </div>
        <RootPasswordComponent visible={authType === "root_password"} rootPassword={rootPassword} />
        <AnotherKeyComponent
          visible={authType === "another_key"}
          privateKey={privateKey}
          privateKeyPassphrase={privateKeyPassphrase}
        />
      </>
    );
  }
);

export default ServerAuthorizationComponent;
