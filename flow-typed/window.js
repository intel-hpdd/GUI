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

declare class Crypto {
  getRandomValues(p: Uint32Array): Uint32Array
}

type cacheInitialDataT = {
  alert: mixed[],
  filesystem: mixed[],
  target: mixed[],
  host: mixed[],
  power_control_type: mixed[],
  server_profile: mixed[],
  lnet_configuration: mixed[],
  job: mixed[],
  session: Object
};

declare var window: {
  clearTimeout: (id: number | null) => void,
  document: Document,
  crypto: Crypto,
  STATIC_URL: string,
  CACHE_INITIAL_DATA: cacheInitialDataT,
  HELP_TEXT: {
    [key: string]: string
  },
  IS_RELEASE: boolean,
  addEventListener: (
    evName: string,
    cb: (ev: Object) => any,
    useCapture: boolean
  ) => void,
  removeEventListener: (
    evName: string,
    cb: (ev: Object) => any,
    useCapture: boolean
  ) => void,
  ALLOW_ANONYMOUS_READ: boolean,
  SERVER_TIME_DIFF: number,
  VERSION: string,
  BUILD: string,
  location: Location,
  requestAnimationFrame: (cb: Function) => number,
  Date: typeof Date,
  decodeURIComponent(str: string): string,
  Intl: {
    NumberFormat: (
      locales: string,
      opts: {
        maximumSignificantDigits?: number,
        maximumFractionDigits?: number,
        minimumSignificantDigits?: number
      }
    ) => Object
  }
};
