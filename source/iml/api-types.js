// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export type hostT = {
  resource_uri: string,
  id: string,
  label: string
};

type groupT = {
  id: string,
  name: string,
  resource_uri: string
};

export type userT = {
  alert_subscriptions: {}[],
  email: string,
  first_name: string,
  full_name: string,
  groups: groupT[],
  gui_config: Object,
  id: string,
  is_superuser: boolean,
  last_name: string,
  new_password1: ?string,
  new_password2: ?string,
  password1: ?string,
  password2: ?string,
  resource_uri: string,
  roles: string,
  username: string
};

export type sessionT = {
  read_enabled: boolean,
  resource_uri: string,
  user: userT
};

export type Meta = {
  limit: number,
  next: ?string,
  offset: number,
  previous: ?string,
  total_count: number
};

export type Point = {|
  data: {|
    [key: string]: number
  |},
  ts: string
|};
