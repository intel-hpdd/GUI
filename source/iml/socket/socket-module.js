// @flow

//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

import angular from 'angular';
import regeneratorModule from '../regenerator/regenerator-module';
import highlandModule from '../highland/highland-module';
import cryptoModule from '../crypto/crypto-module';
import socketWorkerModule from '../socket-worker/socket-worker-module';
import socketStreamFactory from './socket-stream';
import buildResponseErrorFactory from './build-response-error';
import {resolveStreamFactory} from './resolve-stream';
import getSpringFactory from './get-spring';

import type {
  HighlandStreamT
} from 'highland';
export type SocketStreamT<T> = (path:string, options:Object, isAck?:boolean) => HighlandStreamT<T>;
export type resolveStreamT<T> = (stream:HighlandStreamT<T>) => Promise<HighlandStreamT<T>>;

export default angular.module('socket-module', [
  regeneratorModule, highlandModule,
  cryptoModule, socketWorkerModule
])
.factory('socketStream', socketStreamFactory)
.factory('buildResponseError', buildResponseErrorFactory)
.factory('resolveStream', resolveStreamFactory)
.factory('getSpring', getSpringFactory)
.name;
