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

export function uriPropertiesLink (resource_uri:string, label:string)
{
  if (resource_uri) {
    var url = apiPathToUiPath(resource_uri);

    if (resource_uri.indexOf('host') !== -1) {
      var absoluteUrl = '/ui/' + url;
      return `<a href="${absoluteUrl}">${label}</a>`;
    }

    return `<a class="navigation" href="${url}">${label}</a>`;
  } else {
    return '';
  }
}

export function apiPathToUiPath (resource_uri:string)
{
  /* Given an API resource URI for an object,
     return the UI URI for the detail view */
  var resource = resource_uri.split('/')[2];
  var id = resource_uri.split('/')[3];

  if (resource == 'filesystem')
    return `/configure/filesystem/detail/${id}/`;
  else if (resource == 'host')
    return `configure/server/${id}/`;
  else
    return `/${resource}/${id}/`;
}
