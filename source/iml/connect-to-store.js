// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from 'inferno';
import Component from 'inferno-component';
import store from './store/get-store.js';

import type { Element } from 'react';

import type { HighlandStreamT } from 'highland';

export default <B: {}>(key: string, WrappedComponent: (b: B) => Element<*>) =>
  class ConnectToStore extends Component {
    state: B;
    stream: HighlandStreamT<B>;
    componentWillMount() {
      this.stream = store.select(key);

      this.stream.each((x: B) =>
        this.setState({
          [key]: x
        })
      );
    }
    componentWillUnmount() {
      this.stream.destroy();
    }
    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  };
