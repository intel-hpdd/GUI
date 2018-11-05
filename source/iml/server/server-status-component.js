// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Tooltip from "../tooltip.js";
import HelpTooltip from "../help-tooltip.js";
import WindowClickListener from "../window-click-listener.js";
import { PopoverContainer, Popover, PopoverTitle, PopoverContent } from "../popover.js";
import { CSSTransitionGroup } from "inferno-css-transition-group";
import {
  HOST_STATE_UNCONFIGURED,
  HOST_STATE_MANAGED,
  HOST_STATE_MONITORED,
  type ProfileHostT,
  type ProfileProblemT
} from "./server-module.js";

import { type TestHostT } from "./server-module.js";

const STATUS_CELL_CLASS_WARNING: "warning" = "warning";
const STATUS_CELL_CLASS_NEUTRAL: "neutral" = "neutral";
const STATUS_CELL_CLASS_VALID: "valid" = "valid";
const STATUS_CELL_CLASS_INVALID: "invalid" = "invalid";

type StatusCellClassT =
  | typeof STATUS_CELL_CLASS_WARNING
  | typeof STATUS_CELL_CLASS_NEUTRAL
  | typeof STATUS_CELL_CLASS_VALID
  | typeof STATUS_CELL_CLASS_INVALID;

type TestOrProfileHostT = TestHostT | ProfileHostT;
type ServerToStatusCellT = TestOrProfileHostT => StatusCellClassT;
type ServerToBoolean = TestOrProfileHostT => boolean;

const AddressTooltipComponent = (getServerStatusClass: ServerToStatusCellT) => (server: TestOrProfileHostT) => {
  const statusCellClass = getServerStatusClass(server);

  switch (statusCellClass) {
    case STATUS_CELL_CLASS_WARNING:
      return <span>{server.address} deployed but no server profile selected.</span>;
    case STATUS_CELL_CLASS_NEUTRAL:
      return <span>{server.address} deployed.</span>;
    case STATUS_CELL_CLASS_INVALID:
      return <span>{server.address} invalid.</span>;
    case STATUS_CELL_CLASS_VALID:
    default:
      return <span>{server.address}</span>;
  }
};

const StatusComponentBuilder = (
  WrappedComponent: React.StatelessFunctionalComponent<*>,
  getServerStatusClass: ServerToStatusCellT,
  shouldDisplayPopover: ServerToBoolean
) => {
  return ({ hosts }: { hosts: TestHostT[] | ProfileHostT[] }) => {
    const cells = [...hosts].map(host => {
      const addressTooltip = AddressTooltipComponent(getServerStatusClass)(host);

      if (shouldDisplayPopover(host)) {
        const popoverComponent = WrappedComponent({ host });

        return (
          <div class="status-cell-container" key={host.address}>
            <WindowClickListener>
              <PopoverContainer>
                <div
                  className={`status-cell activate-popover tooltip-container tooltip-hover ${getServerStatusClass(
                    host
                  )}`}
                  popoverButton={true}
                >
                  <Tooltip size={"large"} direction="right">
                    {addressTooltip}
                  </Tooltip>
                </div>
                {popoverComponent}
              </PopoverContainer>
            </WindowClickListener>
          </div>
        );
      } else {
        return (
          <div class="status-cell-container" key={host.address}>
            <div className={`status-cell tooltip-container tooltip-hover ${getServerStatusClass(host)}`}>
              <Tooltip size={"large"} direction="right">
                {addressTooltip}
              </Tooltip>
            </div>
          </div>
        );
      }
    });

    const cellContainer =
      cells.length > 0 ? <div class="well clearfix status-cells-container">{[...cells]}</div> : null;

    return (
      <CSSTransitionGroup transitionName="ng" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
        {cellContainer}
      </CSSTransitionGroup>
    );
  };
};

const ServerStatusCellComponent = ({ host }: { host: TestOrProfileHostT }) => {
  let server: TestHostT;

  if (host.status) server = host;
  else return <div />;

  return (
    <Popover popover={true} direction="bottom">
      <PopoverTitle>Status for {server.address}</PopoverTitle>
      <PopoverContent>
        <ul class="well">
          {[...server.status].map(({ ...check }) => {
            return (
              <li key={check.name}>
                <a class="tooltip-container tooltip-hover">
                  <i className={`fa ${check.value === false ? "fa-times-circle" : "fa-check-circle"}`} /> {check.uiName}
                  <HelpTooltip helpKey={check.name} direction="left" size="large" />
                </a>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

const queryServerGetServerStatusClass = (server: TestOrProfileHostT): StatusCellClassT => {
  if (server.deployed && server.state && server.state === HOST_STATE_UNCONFIGURED) return STATUS_CELL_CLASS_WARNING;
  else if (server.deployed) return STATUS_CELL_CLASS_NEUTRAL;
  else if (server.valid) return STATUS_CELL_CLASS_VALID;
  else return STATUS_CELL_CLASS_INVALID;
};

export const QueryServerStatusComponent = StatusComponentBuilder(
  ServerStatusCellComponent,
  queryServerGetServerStatusClass,
  (host: TestOrProfileHostT) => {
    if (host.status) {
      const server: TestHostT = host;
      return server.deployed == null || server.deployed === false || server.state === HOST_STATE_UNCONFIGURED;
    } else {
      return false;
    }
  }
);

const ProfileProblemMessage = ({ problem }: { problem: ProfileProblemT }) => {
  if (problem.error) return <span>There was an error: {problem.error}.</span>;
  else return <span>{problem.description}.</span>;
};

const ProfileHostContentCell = ({ host }: { host: ProfileHostT }) => {
  if (!host.invalid)
    return (
      <div>
        <i class="fa fa-check-circle" /> {host.uiName} profile is compatible.
      </div>
    );
  else
    return (
      <div>
        <div class="callout callout-danger">
          <span>{host.address}</span> incompatible with <span>{host.uiName}</span> profile.
        </div>
        <h4>Reasons: </h4>
        <ul>
          {[...host.problems].map((problem: ProfileProblemT) => {
            <li key={problem.test}>
              <i class="fa fa-times-circle" />
              <ProfileProblemMessage problem={problem} />
            </li>;
          })}
        </ul>
      </div>
    );
};

const ProfileCellComponent = ({ host }: { host: TestOrProfileHostT }) => {
  let profileHost: ProfileHostT;
  if (host.uiName) profileHost = host;
  else return <div />;

  return (
    <Popover popover={true} direction="bottom">
      <PopoverTitle>Status for {host.address}</PopoverTitle>
      <PopoverContent>
        <ProfileHostContentCell host={profileHost} />
      </PopoverContent>
    </Popover>
  );
};

const getProfileServerStatusClass = (host: TestOrProfileHostT) => (host.invalid ? "invalid" : "valid");
export const ProfileStatusComponent = StatusComponentBuilder(
  ProfileCellComponent,
  getProfileServerStatusClass,
  () => true
);

const ServerCompleteContentComponent = ({ server }: { server: TestHostT }) => {
  if (server.valid === true && (server.state === HOST_STATE_MANAGED || server.state === HOST_STATE_MONITORED))
    return (
      <div>
        <i class="fa fa-check-circle" /> {server.address} setup successfully.
      </div>
    );
  else
    return (
      <div>
        <i class="fa fa-times-circle" /> {server.address} did not complete setup.
      </div>
    );
};

const ServerCompleteCellComponent = ({ host }: { host: TestOrProfileHostT }) => {
  let server: TestHostT;

  if (host.status) server = host;
  else return <div />;

  return (
    <Popover popover={true} direction="bottom">
      <PopoverTitle>Status for {server.address}</PopoverTitle>
      <PopoverContent>
        <ServerCompleteContentComponent server={server} />
      </PopoverContent>
    </Popover>
  );
};

const getCompleteStatusClass = (server: TestOrProfileHostT): StatusCellClassT => {
  if ((server.deployed === true && server.state === HOST_STATE_MANAGED) || server.state === HOST_STATE_MONITORED)
    return STATUS_CELL_CLASS_VALID;
  else return STATUS_CELL_CLASS_INVALID;
};

export const CompleteStatusComponent = StatusComponentBuilder(
  ServerCompleteCellComponent,
  getCompleteStatusClass,
  () => true
);
