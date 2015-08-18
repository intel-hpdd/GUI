//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2014 Intel Corporation All Rights Reserved.
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

angular.module('dataFixtures').value('networkInterfaceDataFixtures', [
  {
    in: [{
      "host": {
        "address": "test000.localdomain",
        "available_jobs": null,
        "available_transitions": null,
        "boot_time": "2014-09-05T23:03:34.318276+00:00",
        "client_mounts": [],
        "content_type_id": 31,
        "corosync_reported_up": true,
        "fqdn": "test000.localdomain",
        "id": "6",
        "immutable_state": false,
        "install_method": "manual",
        "label": "test000",
        "locks": { "read": [], "write": [] },
        "member_of_active_filesystem": false,
        "needs_fence_reconfiguration": false,
        "needs_update": false,
        "nids": ["10.3.0.0@o2ib3", "10.1.0.0@o2ib1", "10.4.0.0@tcp4", "10.2.0.0@tcp2", "10.0.0.0@tcp0"],
        "nodename": "test000",
        "private_key": null,
        "private_key_passphrase": null,
        "properties": "{}",
        "resource_uri": "/api/host/6/",
        "root_pw": null,
        "server_profile": {
          "default": false,
          "managed": true,
          "name": "base_managed",
          "resource_uri": "/api/server_profile/base_managed/",
          "ui_description": "A storage server suitable for creating new HA-enabled filesystem targets",
          "ui_name": "Managed storage server",
          "worker": false
        },
        "state": "lnet_up",
        "state_modified_at": "2014-09-05T23:04:00.382143+00:00",
        "version": 1409962275.808059
      },
      "id": "26",
      "inet4_address": "10.3.0.0",
      "name": "ib3",
      "nid": {
        "acceptable_lnd_types": ["o2ib", "tcp"],
        "lnd_type": "o2ib",
        "lnd_network": 3,
        "lnet_configuration": "/api/lnet_configuration/6/",
        "network_interface": "/api/network_interface/26/",
        "resource_uri": "/api/nid/26/"
      },
      "resource_uri": "/api/network_interface/26/",
      "state_up": true,
      "type": "o2ib"
    }, {
      "host": {
        "address": "test000.localdomain",
        "available_jobs": null,
        "available_transitions": null,
        "boot_time": "2014-09-05T23:03:34.318276+00:00",
        "client_mounts": [],
        "content_type_id": 31,
        "corosync_reported_up": true,
        "fqdn": "test000.localdomain",
        "id": "6",
        "immutable_state": false,
        "install_method": "manual",
        "label": "test000",
        "locks": { "read": [], "write": [] },
        "member_of_active_filesystem": false,
        "needs_fence_reconfiguration": false,
        "needs_update": false,
        "nids": ["10.3.0.0@o2ib3", "10.1.0.0@o2ib1", "10.4.0.0@tcp4", "10.2.0.0@tcp2", "10.0.0.0@tcp0"],
        "nodename": "test000",
        "private_key": null,
        "private_key_passphrase": null,
        "properties": "{}",
        "resource_uri": "/api/host/6/",
        "root_pw": null,
        "server_profile": {
          "default": false,
          "managed": true,
          "name": "base_managed",
          "resource_uri": "/api/server_profile/base_managed/",
          "ui_description": "A storage server suitable for creating new HA-enabled filesystem targets",
          "ui_name": "Managed storage server",
          "worker": false
        },
        "state": "lnet_up",
        "state_modified_at": "2014-09-05T23:04:00.382143+00:00",
        "version": 1409962275.808059
      },
      "id": "27",
      "inet4_address": "10.1.0.0",
      "name": "ib1",
      "nid": {
        "acceptable_lnd_types" : ["o2ib", "tcp"],
        "lnd_type": "o2ib",
        "lnd_network": 1,
        "lnet_configuration": "/api/lnet_configuration/6/",
        "network_interface": "/api/network_interface/27/",
        "resource_uri": "/api/nid/27/"
      },
      "resource_uri": "/api/network_interface/27/",
      "state_up": true,
      "type": "o2ib"
    }, {
      "host": {
        "address": "test000.localdomain",
        "available_jobs": null,
        "available_transitions": null,
        "boot_time": "2014-09-05T23:03:34.318276+00:00",
        "client_mounts": [],
        "content_type_id": 31,
        "corosync_reported_up": true,
        "fqdn": "test000.localdomain",
        "id": "6",
        "immutable_state": false,
        "install_method": "manual",
        "label": "test000",
        "locks": { "read": [], "write": [] },
        "member_of_active_filesystem": false,
        "needs_fence_reconfiguration": false,
        "needs_update": false,
        "nids": ["10.3.0.0@o2ib3", "10.1.0.0@o2ib1", "10.4.0.0@tcp4", "10.2.0.0@tcp2", "10.0.0.0@tcp0"],
        "nodename": "test000",
        "private_key": null,
        "private_key_passphrase": null,
        "properties": "{}",
        "resource_uri": "/api/host/6/",
        "root_pw": null,
        "server_profile": {
          "default": false,
          "managed": true,
          "name": "base_managed",
          "resource_uri": "/api/server_profile/base_managed/",
          "ui_description": "A storage server suitable for creating new HA-enabled filesystem targets",
          "ui_name": "Managed storage server",
          "worker": false
        },
        "state": "lnet_up",
        "state_modified_at": "2014-09-05T23:04:00.382143+00:00",
        "version": 1409962275.808059
      },
      "id": "28",
      "inet4_address": "10.4.0.0",
      "name": "eth4",
      "nid": {
        "acceptable_lnd_types" : ["o2ib", "tcp"],
        "lnd_type": "o2ib",
        "lnd_network": 4,
        "lnet_configuration": "/api/lnet_configuration/6/",
        "network_interface": "/api/network_interface/28/",
        "resource_uri": "/api/nid/28/"
      },
      "resource_uri": "/api/network_interface/28/",
      "state_up": true,
      "type": "tcp"
    }, {
      "host": {
        "address": "test000.localdomain",
        "available_jobs": null,
        "available_transitions": null,
        "boot_time": "2014-09-05T23:03:34.318276+00:00",
        "client_mounts": [],
        "content_type_id": 31,
        "corosync_reported_up": true,
        "fqdn": "test000.localdomain",
        "id": "6",
        "immutable_state": false,
        "install_method": "manual",
        "label": "test000",
        "locks": { "read": [], "write": [] },
        "member_of_active_filesystem": false,
        "needs_fence_reconfiguration": false,
        "needs_update": false,
        "nids": ["10.3.0.0@o2ib3", "10.1.0.0@o2ib1", "10.4.0.0@tcp4", "10.2.0.0@tcp2", "10.0.0.0@tcp0"],
        "nodename": "test000",
        "private_key": null,
        "private_key_passphrase": null,
        "properties": "{}",
        "resource_uri": "/api/host/6/",
        "root_pw": null,
        "server_profile": {
          "default": false,
          "managed": true,
          "name": "base_managed",
          "resource_uri": "/api/server_profile/base_managed/",
          "ui_description": "A storage server suitable for creating new HA-enabled filesystem targets",
          "ui_name": "Managed storage server",
          "worker": false
        },
        "state": "lnet_up",
        "state_modified_at": "2014-09-05T23:04:00.382143+00:00",
        "version": 1409962275.808059
      },
      "id": "29",
      "inet4_address": "10.2.0.0",
      "name": "eth2",
      "nid": {
        "acceptable_lnd_types" : ["o2ib", "tcp"],
        "lnd_type": "tcp",
        "lnd_network": 2,
        "lnet_configuration": "/api/lnet_configuration/6/",
        "network_interface": "/api/network_interface/29/",
        "resource_uri": "/api/nid/29/"
      },
      "resource_uri": "/api/network_interface/29/",
      "state_up": true,
      "type": "tcp"
    }, {
      "host": {
        "address": "test000.localdomain",
        "available_jobs": null,
        "available_transitions": null,
        "boot_time": "2014-09-05T23:03:34.318276+00:00",
        "client_mounts": [],
        "content_type_id": 31,
        "corosync_reported_up": true,
        "fqdn": "test000.localdomain",
        "id": "6",
        "immutable_state": false,
        "install_method": "manual",
        "label": "test000",
        "locks": { "read": [], "write": [] },
        "member_of_active_filesystem": false,
        "needs_fence_reconfiguration": false,
        "needs_update": false,
        "nids": ["10.3.0.0@o2ib3", "10.1.0.0@o2ib1", "10.4.0.0@tcp4", "10.2.0.0@tcp2", "10.0.0.0@tcp0"],
        "nodename": "test000",
        "private_key": null,
        "private_key_passphrase": null,
        "properties": "{}",
        "resource_uri": "/api/host/6/",
        "root_pw": null,
        "server_profile": {
          "default": false,
          "managed": true,
          "name": "base_managed",
          "resource_uri": "/api/server_profile/base_managed/",
          "ui_description": "A storage server suitable for creating new HA-enabled filesystem targets",
          "ui_name": "Managed storage server",
          "worker": false
        },
        "state": "lnet_up",
        "state_modified_at": "2014-09-05T23:04:00.382143+00:00",
        "version": 1409962275.808059
      },
      "id": "30",
      "inet4_address": "10.0.0.0",
      "name": "eth0",
      "nid": {
        "acceptable_lnd_types" : ["o2ib", "tcp"],
        "lnd_type": "o2ib",
        "lnd_network": 0,
        "lnet_configuration": "/api/lnet_configuration/6/",
        "network_interface": "/api/network_interface/30/",
        "resource_uri": "/api/nid/30/"
      },
      "resource_uri": "/api/network_interface/30/",
      "state_up": true,
      "type": "tcp"
    }]
  }
]);
