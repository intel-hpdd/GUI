// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import global from './global.js';

export const STATIC_URL = '/gui/';
export const CACHE_INITIAL_DATA = global.CACHE_INITIAL_DATA;
export const UI_ROOT = document.baseURI || '';
export const HELP_TEXT = global.HELP_TEXT;
export const IS_RELEASE = global.IS_RELEASE;
export const ALLOW_ANONYMOUS_READ = global.ALLOW_ANONYMOUS_READ;
export const SERVER_TIME_DIFF = global.SERVER_TIME_DIFF;
export const VERSION = global.VERSION;
export const BUILD = global.BUILD;
export const BASE = `${global.location.protocol}//${global.location.hostname}`;
export const API = `${BASE}:${global.location.port}/api/`;
export const RUNTIME_VERSION = IS_RELEASE ? VERSION : `Build ${BUILD}`;
