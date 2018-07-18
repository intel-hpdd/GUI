// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from 'inferno';
import Component from 'inferno-component';

import type { HighlandStreamT } from 'highland';

export default <A, B: {}>(mapFn: (a: A) => B, WrappedComponent: (b: B) => React$Element<*>) =>
  class Connect extends Component {
    static defaultProps: {};
    state: B;
    props: {
      stream: HighlandStreamT<any>
    };
    componentWillMount() {
      this.props.stream
        .fork()
        .map(mapFn)
        .each((x: B) => this.setState(x));
    }
    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  };
