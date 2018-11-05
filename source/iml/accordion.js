// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { Component } from "inferno";
import { cloneVNode } from "inferno-clone-vnode";

type PanelComponentPropsT = {
  collapsed: boolean,
  accordionId: string,
  panelId: string,
  headingId: string,
  children: React$Element<*>[]
};

type PanelComponentStateT = {
  collapsed: boolean
};

export class PanelComponent extends Component {
  state: PanelComponentStateT;
  props: PanelComponentPropsT;

  constructor(props: PanelComponentPropsT) {
    super(props);

    this.state = {
      collapsed: props.collapsed
    };
  }

  togglePanel() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    const title = cloneVNode(this.props.children[0], { collapsed: this.state.collapsed });

    return (
      <div class="panel panel-default">
        <div class="panel-heading" role="tab" id={this.props.headingId}>
          <h4 class="panel-title">
            <a
              className={this.state.collapsed ? "collapsed" : ""}
              role="button"
              data-toggle="collapse"
              data-parent={`#${this.props.accordionId}`}
              aria-expanded={!this.props.collapsed}
              aria-controls={this.props.panelId}
              onClick={this.togglePanel.bind(this)}
            >
              {title}
            </a>
          </h4>
        </div>
        <div
          id={this.props.panelId}
          className={`panel-collapse collapse ${!this.state.collapsed ? "in" : ""}`}
          role="tabpanel"
          aria-labelledby={this.props.headingId}
        >
          <div class="panel-body">{this.props.children[1]}</div>
        </div>
      </div>
    );
  }
}

type AccordionT = {
  id: string,
  children: React$Element<*>
};

export default ({ id, children }: AccordionT) => {
  return (
    <div class="panel-group" id={id} role="tablist" aria-multiselectable="true">
      {children}
    </div>
  );
};
