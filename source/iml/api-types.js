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
  accepted_eula: boolean,
  alert_subscriptions: {}[],
  email: string,
  eula_state: 'eula' | 'pass' | 'denied',
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
