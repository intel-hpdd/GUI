// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { render, Component } from "inferno";
import Tooltip from "../tooltip.js";
import WindowClickListener from "../window-click-listener.js";
import DropdownContainer from "../dropdown-component.js";
import { handleAction } from "./handle-action.js";
import overrideActionClick from "../server/override-action-click.js";
import groupActions from "./group-actions.js";

import type { directionsT } from "../tooltip.js";
import getStore from "../store/get-store.js";
import type { AvailableActionT, HostT } from "../server/server-module.js";

type ActionButtonT = {
  records: HostT[]
};

type ActionDropdownChangesT = {
  tooltipPlacement: { currentValue: string, previousValue: string },
  record: { currentValue: HostT, previousValue: HostT }
};

const ActionButton = ({ records }: ActionButtonT): ?React.Element<"button"> => {
  if (records.length > 0)
    return (
      <button class="btn btn-primary btn-sm" aria-haspopup="true" aria-expanded="false">
        Actions
        <i class="fa fa-caret-down" />
      </button>
    );
  else return null;
};

const ActionItem = ({
  action,
  tooltipPlacement,
  handleAction
}: {
  action: AvailableActionT,
  tooltipPlacement: directionsT,
  handleAction: Function
}) => {
  const classList = `tooltip-container tooltip-hover${action.last === true ? " end-of-group" : ""}`;

  return (
    <li className={classList}>
      <a onclick={() => handleAction(action)}>{action.verb}</a>
      <Tooltip direction={tooltipPlacement} size="large">
        <span dangerouslySetInnerHTML={{ __html: action.long_description }} />
      </Tooltip>
    </li>
  );
};

const ActionHeader = ({ label }: { label: string }) => {
  return <li class="dropdown-header">{label}</li>;
};

const ActionItemsList = ({
  records,
  tooltipPlacement,
  handleAction
}: {
  records: HostT[],
  tooltipPlacement: directionsT,
  handleAction: Function
}): React.Element<"ul"> => {
  const items = records.map(record => {
    const header = <ActionHeader label={record.label} />;
    const actions = record.available_actions.map(action => (
      <ActionItem action={action} tooltipPlacement={tooltipPlacement} handleAction={handleAction(record)} />
    ));

    return [header].concat(actions).concat([<li class="divider" />]);
  });
  const recordItems = [].concat(...items);

  return (
    <ul role="menu" class="dropdown-menu">
      {recordItems}
    </ul>
  );
};

type ActionDropdownT = {
  records: HostT[],
  tooltipPlacement: directionsT,
  actionsProperty: string,
  overrideClick: ?Function
};

type ActionDropdownStateT = {
  confirmOpen: boolean
};

class ActionDropdown extends Component {
  props: ActionDropdownT;
  state: ActionDropdownStateT;

  constructor(props: ActionDropdownT) {
    super(props);

    this.state = {
      confirmOpen: false
    };

    this.props.records = Array.isArray(this.props.records) ? this.props.records : [this.props.records];

    getStore.select("actionDropdown").each((x: Object) => {
      console.log("received inactive event");
      if (this.state.confirmOpen === true)
        this.setState({
          confirmOpen: false
        });
    });
  }

  handleAction = record => action => {
    this.setState({
      confirmOpen: true
    });

    if (this.props.overrideClick === true) overrideActionClick(action, record);
    else handleAction(action, record);
  };

  render() {
    const records = (Array.isArray(this.props.records) ? this.props.records : [this.props.records])
      .filter(x => x.locks && x[this.props.actionsProperty])
      .map(item => ({ ...item, [this.props.actionsProperty]: groupActions(item[this.props.actionsProperty]) }));

    const writeLocks: number = records.map(record => record.locks.write.length).reduce((x, y) => x + y, 0);
    console.log("write locks", writeLocks);
    if (writeLocks > 0 || this.state.confirmOpen) {
      return (
        <div class="action-dropdown">
          <button disabled class="btn btn-primary btn-sm">
            Disabled
          </button>
        </div>
      );
    } else if (records.length === 0) {
      return (
        <div class="action-dropdown">
          <button disabled class="btn btn-primary btn-sm">
            No Actions
          </button>
        </div>
      );
    } else if (writeLocks === 0 && !this.state.confirmOpen) {
      const actionButton = ActionButton({
        records
      });
      const actionItemsList = ActionItemsList({
        records,
        tooltipPlacement: this.props.tooltipPlacement || "left",
        handleAction: this.handleAction
      });

      if (actionButton)
        return (
          <div class="action-dropdown">
            <WindowClickListener>
              <DropdownContainer>
                {actionButton}
                {actionItemsList}
              </DropdownContainer>
            </WindowClickListener>
          </div>
        );
    }
  }
}

export const actionDropdown = {
  bindings: {
    tooltipPlacement: "@?",
    actionsProperty: "@?",
    records: "<",
    overrideClick: "<"
  },
  controller: function($element: HTMLElement[]) {
    const el = $element[0];
    const bindings: { tooltipPlacement: string, records: HostT } = {
      tooltipPlacement: this.tooltipPlacement,
      records: this.records
    };

    this.$onChanges = (changesObj: ActionDropdownChangesT) => {
      console.log("changesObj", changesObj);
      const { tooltipPlacement, records } = Object.entries(changesObj)
        .map(([key, val]) => {
          if (typeof val === "object" && val != null && val.currentValue != null) return [key, val.currentValue];
          else return [key, null];
        })
        .reduce((prev, [key, val]) => {
          prev[key] = val;
          return prev;
        }, bindings);

      if (records != null)
        render(
          <ActionDropdown
            tooltipPlacement={tooltipPlacement || "left"}
            actionsProperty={this.actionsProperty || "available_actions"}
            records={records}
            overrideClick={this.overrideClick}
          />,
          el
        );
      else
        render(
          <div class="action-dropdown">
            <button class="btn btn-primary btn-sm">
              Actions
              <i class="fa fa-caret-down" />
            </button>
          </div>,
          el
        );
    };
  }
};
