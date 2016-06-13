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


export const STATIC_URL = window.STATIC_URL;
export const CACHE_INITIAL_DATA = window.CACHE_INITIAL_DATA;
export const UI_ROOT = document.baseURI;
export const HELP_TEXT = window.HELP_TEXT;
export const IS_RELEASE = window.IS_RELEASE;
export const ALLOW_ANONYMOUS_READ = window.ALLOW_ANONYMOUS_READ;
export const SERVER_TIME_DIFF = window.SERVER_TIME_DIFF;
export const VERSION = window.VERSION;
export const BUILD = window.BUILD;
export const BASE = `${window.location.protocol}//${window.location.hostname}`;
export const API = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/`;
export const RUNTIME_VERSION = window.IS_RELEASE ? window.version : `Build ${window.BUILD}`;