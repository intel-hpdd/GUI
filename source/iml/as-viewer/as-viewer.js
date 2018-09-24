//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { Element } from "react";
import type { HighlandStreamT } from "highland";
import type { streamFnT } from "../broadcaster.js";

import Inferno from "inferno";
import Component from "inferno-component";

export const asViewer = <B: {}>(key: string, WrappedComponent: (b: B) => Element<*>) =>
  class AsViewer extends Component {
    state: B;
    stream: HighlandStreamT<B>;
    props: {
      viewer: () => HighlandStreamT<B>
    };
    componentWillMount() {
      this.viewer = this.props.viewer();

      this.viewer.each((x: B) =>
        this.setState({
          [key]: x
        })
      );
    }
    componentWillUnmount() {
      this.viewer.destroy();
    }
    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  };

export const asViewers = <B: {}>(keys: string[], WrappedComponent: (b: B) => Element<*>) => {
  if (keys.length !== [...new Set(keys)].length) throw new Error("asViewers keys must be unique.");
  else
    return class AsViewers extends Component {
      state: B;
      viewers: streamFnT;
      props: {
        viewers: () => HighlandStreamT<B>
      };
      componentWillMount() {
        this.viewers = this.props.viewers;

        this.viewers.forEach(viewer => {
          viewer.each((data: Object) => {
            const key = keys.find(key => data[key] != null);

            if (key)
              this.setState({
                [key]: data[key]
              });
          });
        });
      }
      componentWillUnmount() {
        this.viewers.forEach(viewer => viewer.destroy());
      }
      render() {
        return <WrappedComponent {...this.props} {...this.state} />;
      }
    };
};

export default () => {
  return {
    restrict: "A",
    transclude: true,
    scope: {
      stream: "=",
      args: "=?",
      transform: "&?",
      name: "<"
    },
    link: function link(scope, el, attrs, ctrl, $transclude) {
      const name = scope.name || "viewer";

      $transclude((clone, transcludedScope) => {
        if (transcludedScope.viewer) throw new Error(`${name} already set on transcluded scope.`);

        let viewer = scope.stream();

        scope.$on("$destroy", () => viewer.destroy());

        if (scope.transform)
          viewer = scope.transform({
            stream: viewer,
            args: scope.args || []
          });

        transcludedScope[name] = viewer;

        el.append(clone);
      });
    }
  };
};
