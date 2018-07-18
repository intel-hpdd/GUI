// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export type chartParamsT = {
  qs?: {
    id?: string,
    filesystem_id?: string
  }
};
export type scopeToElementT = (scope: Object) => HTMLElement[];
export type chartT = (overrides: chartParamsT, page: string) => Promise<scopeToElementT>;
export type chartTitleT = (title: string, overrides: chartParamsT, page: string) => Promise<scopeToElementT>;
export type chartTitleKeyT = (
  title: string,
  key: string,
  overrides: chartParamsT,
  page: string
) => Promise<scopeToElementT>;
