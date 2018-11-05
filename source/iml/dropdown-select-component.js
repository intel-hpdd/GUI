// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { cloneVNode } from "inferno-clone-vnode";
import { linkEvent, Component } from "inferno";

const getOptionText = (node: React$Element<"li">) => node.children.children;

type DropdownSelectPropsT = {
  isOpen?: boolean,
  extraCss?: string[],
  toggleOpen?: Function,
  onSelectItem?: Function,
  children: React$Element<*>
};

type DropdownSelectStateT = {
  selectedItem: string,
  liChildren: React$Element<*>[]
};

class DropdownSelectComponent extends Component {
  props: DropdownSelectPropsT;
  state: DropdownSelectStateT;

  constructor(props: DropdownSelectPropsT) {
    super(props);

    const liChildren = props.children.children.map(item => {
      return cloneVNode(item, {
        onClick: () => {
          this.setState({
            selectedItem: getOptionText(item)
          });

          if (this.props.onSelectItem != null) this.props.onSelectItem(getOptionText(item));
        }
      });
    });

    this.state = {
      selectedItem: liChildren[0].children.children,
      liChildren
    };
  }

  render() {
    return (
      <div
        className={`btn-group dropdown ${this.props.extraCss ? this.props.extraCss.join(" ") : ""} ${
          this.props.isOpen ? "open" : ""
        }`}
      >
        <button
          type="button"
          class="form-control dropdown-toggle"
          aria-haspopup="true"
          aria-expanded="false"
          onClick={this.props.toggleOpen}
        >
          <span>{this.state.selectedItem}</span>
          <i className={`fa ${this.props.isOpen ? "fa-caret-down" : "fa-caret-up"}`} />
        </button>
        <ul role="menu" class="dropdown-menu">
          {this.state.liChildren}
        </ul>
      </div>
    );
  }
}

export default DropdownSelectComponent;
