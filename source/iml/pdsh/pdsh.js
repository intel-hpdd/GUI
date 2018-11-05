// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { Component, render } from "inferno";
import WindowClickListener from "../window-click-listener.js";
import Tooltip from "../tooltip.js";
import { PopoverContainer, Popover, PopoverTitle, PopoverContent } from "../popover.js";
import pdshParser from "@iml/pdsh-parser";
import { getHelpContent } from "../help.js";
import Spinner from "../spinner.js";
import { CSSTransitionGroup } from "inferno-css-transition-group";
import debounce from "@iml/debounce";

const STATE_NEUTRAL = "";
const STATE_SUCCESS = "has-success";
const STATE_ERROR = "has-error";

export default {
  bindings: {
    onExpressionSet: "&",
    pdshRequired: "=?",
    pdshInitial: "=?",
    pdshPlaceholder: "@?",
    pdshTooltipMessage: "@?",
    pdshLabel: "@?",
    showSpinner: "=?"
  },
  controller: function($element: HTMLElement[]) {
    const ctrl = this;

    ctrl.setExpression = (pdsh, hostnames, hostnamesHash) => {
      ctrl.onExpressionSet({
        pdsh,
        hostnames,
        hostnamesHash
      });
    };

    render(
      <PdshComponent
        onExpressionSet={ctrl.setExpression}
        pdshPlaceholder={ctrl.pdshPlaceholder}
        pdshTooltipMessage={ctrl.pdshTooltipMessage}
        pdshLabel={ctrl.pdshLabel}
        pdshInitial={ctrl.pdshInitial}
        pdshRequired={ctrl.pdshRequired}
        showSpinner={ctrl.showSpinner}
      />,
      $element[0]
    );
  }
};

type PdshProps = {
  pdshPlaceholder?: string,
  pdshTooltipMessage?: string,
  pdshInitial?: string,
  pdshRequired?: boolean,
  onExpressionSet?: (string, string[], Object) => any,
  showSpinner?: boolean,
  pdshLabel?: string
};

type PdshState = {
  hostnameSections: string[],
  errorMessages: string[],
  pdsh: string,
  hostnames: string[],
  hostnamesHash: { [key: string]: string },
  parsedState: typeof STATE_NEUTRAL | typeof STATE_SUCCESS | typeof STATE_ERROR
};

type ParsedExpressionT =
  | {
      errors: any[]
    }
  | {
      expansion: any[],
      sections: any[],
      expansionHash: { [name: string]: string }
    };

const PdshErrors = ({ errorMessages }: { errorMessages: string[] }): React.Element<typeof Tooltip> | null => {
  if (!errorMessages.length) return null;

  return (
    <Tooltip size={"medium"} direction={"bottom"} moreClasses={["error-tooltip", "in"]}>
      <ul>
        {errorMessages.map(message => (
          <li>{message}</li>
        ))}
      </ul>
    </Tooltip>
  );
};

const HostnamePopover = ({
  hostnameSections
}: {
  hostnameSections: string[]
}): React.Element<typeof Popover> | React.Element<"div"> => {
  if (!hostnameSections.length) return <div />;

  return (
    <Popover popover={true} direction="bottom">
      <PopoverTitle>Hosts</PopoverTitle>
      <PopoverContent>
        <ul class="well">
          {hostnameSections.map(section => (
            <li>
              <span>{section}</span>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export class PdshComponent extends Component {
  props: PdshProps;
  state: PdshState;

  constructor(props: PdshProps) {
    super(props);

    this.state = {
      hostnameSections: [],
      errorMessages: [],
      pdsh: "",
      hostnames: [],
      hostnamesHash: {},
      parsedState: STATE_NEUTRAL
    };
  }

  componentWillMount() {
    this.parseExpression(this.props.pdshInitial || "");
  }

  parseExpression = (pdshExpression: string) => {
    if (pdshExpression == null) return;

    const parsedExpression: ParsedExpressionT = pdshParser(pdshExpression.replace(" ", ""));
    let errorMessages = [];
    if (this.props.pdshRequired && pdshExpression === "") errorMessages = ["Expression required."];

    let hostnames: string[] = [],
      hostnamesHash = {};

    if (parsedExpression.errors && pdshExpression.length > 0) {
      this.setState({
        parsedState: STATE_ERROR,
        pdsh: pdshExpression,
        hostnames: [],
        hostnamesHash: {},
        hostnameSections: [],
        errorMessages: errorMessages.concat(parsedExpression.errors)
      });
    } else if (parsedExpression.expansion && !parsedExpression.errors && pdshExpression.length > 0) {
      hostnames = (parsedExpression.expansion: any);
      hostnamesHash = parsedExpression.expansionHash;

      this.setState({
        parsedState: STATE_SUCCESS,
        pdsh: pdshExpression,
        hostnames: hostnames,
        hostnamesHash: hostnamesHash,
        hostnameSections: parsedExpression.sections,
        errorMessages
      });
    } else {
      this.setState({
        parsedState: STATE_NEUTRAL,
        pdsh: pdshExpression,
        hostnames: [],
        hostnamesHash: {},
        hostnameSections: [],
        errorMessages
      });
    }

    if (this.props.onExpressionSet != null) this.props.onExpressionSet(pdshExpression, hostnames, hostnamesHash);
  };

  debounceParseExpression = debounce((this.parseExpression: any), 1000);

  render() {
    const pdshInitial = this.props.pdshInitial || "";
    const pdshPlaceholder = this.props.pdshPlaceholder || getHelpContent("pdsh_placeholder").__html;
    const pdshTooltipMessage =
      this.props.pdshTooltipMessage || "Enter a hostlist expression for servers that you would like to add.";
    const pdshRequired = this.props.pdshRequired != null ? this.props.pdshRequired : true;
    const showSpinner = this.props.showSpinner != null ? this.props.showSpinner : false;
    const pdshLabel = this.props.pdshLabel || "Enter Hostlist Expression";

    if (this.state.pdsh === "" && pdshInitial !== "") this.parseExpression(pdshInitial);

    const hostnamePopover = HostnamePopover({ hostnameSections: this.state.hostnameSections });
    const spinner = showSpinner ? <Spinner display={true} /> : null;

    return (
      <div className={`form-group pdsh-input${this.state.errorMessages.length ? " has-error" : ""}`}>
        <div>
          <label>{pdshLabel}</label>
          <span class="icon-wrap tooltip-container tooltip-hover">
            <i class="fa fa-question-circle" />
            <Tooltip size={"medium"} direction={"right"} message={pdshTooltipMessage} />
          </span>
        </div>
        <div class="input-group">
          <WindowClickListener>
            <PopoverContainer>
              <div class="input-group-addon tooltip-container tooltip-hover hostname-popover" popoverButton={true}>
                <i class="fa activate-popover fa-list-ul">
                  <Tooltip size={"medium"} direction={"right"} message={"Click for expanded hostlist expression."} />
                </i>
              </div>
              {hostnamePopover}
            </PopoverContainer>
          </WindowClickListener>
          <input
            className="form-control"
            type="search"
            name="pdsh"
            placeholder={pdshPlaceholder}
            required={pdshRequired}
            value={this.state.pdsh}
            onInput={e => {
              this.setState({ pdsh: e.currentTarget.value });
              this.debounceParseExpression(e.currentTarget.value);
            }}
          />
          <div class="spinner-container">
            <CSSTransitionGroup transitionName="ng" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
              {spinner}
            </CSSTransitionGroup>
          </div>
          <PdshErrors errorMessages={this.state.errorMessages} />
        </div>
      </div>
    );
  }
}
