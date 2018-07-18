//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';

import type { Element } from 'react';
import type { HighlandStreamT } from 'highland';

import Inferno from 'inferno';
import Component from 'inferno-component';

export const asValue = <B: {}>(key: string, WrappedComponent: (b: B) => Element<*>) =>
  class AsValue extends Component {
    state: B;
    props: {
      stream: HighlandStreamT<B>
    };
    componentWillMount() {
      this.props.stream.fork().each((x: B) =>
        this.setState({
          [key]: x
        })
      );
    }
    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  };

export default (localApply, $exceptionHandler) => {
  'ngInject';
  return {
    restrict: 'A',
    transclude: true,
    scope: {
      stream: '='
    },
    link: function link(scope, el, attrs, ctrl, $transclude) {
      $transclude(function createValue(clone, transcludedScope) {
        if (transcludedScope.curr) throw new Error('curr already set on transcluded scope.');

        transcludedScope.curr = {};

        scope.stream
          .fork()
          .tap(v => (transcludedScope.curr.val = v))
          .stopOnError(fp.unary($exceptionHandler))
          .each(localApply.bind(null, transcludedScope));

        el.append(clone);
      });
    }
  };
};
