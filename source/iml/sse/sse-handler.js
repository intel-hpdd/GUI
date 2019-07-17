// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import getSSEStream from "./sse-stream.js";
import getStore from "../store/get-store.js";
import { UPDATE_LOCKS_ACTION } from "../locks/locks-reducer.js";
import {
  ADD_ALERT_INDICATOR_ITEMS,
  UPDATE_ALERT_INDICATOR_ITEM,
  DELETE_ALERT_INDICATOR_ITEM
} from "../alert-indicator/alert-indicator-reducer.js";
import { ADD_FS_ITEMS, DELETE_FILESYSTEM_ITEM, UPDATE_FILESYSTEM_ITEM } from "../file-system/file-system-reducer.js";
import { ADD_SERVER_ITEMS, UPDATE_SERVER_ITEM, DELETE_SERVER_ITEM } from "../server/server-reducer.js";
import {
  UPDATE_LNET_CONFIGURATION_ITEM,
  DELETE_LNET_CONFIGURATION_ITEM,
  ADD_LNET_CONFIGURATION_ITEMS
} from "../lnet/lnet-configuration-reducer.js";
import {
  ADD_MANAGED_TARGET_MOUNT_ITEMS,
  UPDATE_MANAGED_TARGET_MOUNT_ITEM,
  DELETE_MANAGED_TARGET_MOUNT_ITEM
} from "../managed-target-mount/managed-target-mount-reducer.js";
import { ADD_STRATAGEM_ITEMS, UPDATE_STRATAGEM_ITEM, DELETE_STRATAGEM_ITEM } from "../stratagem/stratagem-reducer.js";
import { ADD_TARGET_ITEMS, UPDATE_TARGET_ITEM, DELETE_TARGET_ITEM } from "../target/target-reducer.js";
import { ADD_VOLUME_ITEMS, UPDATE_VOLUME_ITEM, DELETE_VOLUME_ITEM } from "../volume/volume-reducer.js";
import {
  ADD_VOLUME_NODE_ITEMS,
  UPDATE_VOLUME_NODE_ITEM,
  DELETE_VOLUME_NODE_ITEM
} from "../volume/volume-node-reducer.js";

getSSEStream().each(({ tag, payload }) => {
  switch (tag) {
    case "Locks":
      getStore.dispatch({
        type: UPDATE_LOCKS_ACTION,
        payload
      });
      break;
    case "Records":
      getStore.dispatch({
        type: ADD_ALERT_INDICATOR_ITEMS,
        payload: payload.active_alert
      });

      getStore.dispatch({
        type: ADD_FS_ITEMS,
        payload: payload.filesystem
      });

      getStore.dispatch({
        type: ADD_SERVER_ITEMS,
        payload: payload.host
      });

      getStore.dispatch({
        type: ADD_LNET_CONFIGURATION_ITEMS,
        payload: payload.lnet_configuration
      });

      getStore.dispatch({
        type: ADD_MANAGED_TARGET_MOUNT_ITEMS,
        payload: payload.managed_target_mount
      });

      getStore.dispatch({
        type: ADD_STRATAGEM_ITEMS,
        payload: payload.stratagem_config
      });

      getStore.dispatch({
        type: ADD_TARGET_ITEMS,
        payload: payload.target
      });

      getStore.dispatch({
        type: ADD_VOLUME_ITEMS,
        payload: payload.volume
      });

      getStore.dispatch({
        type: ADD_VOLUME_NODE_ITEMS,
        payload: payload.volume_node
      });

      break;
    case "RecordChange":
      handleRecordChange(payload);
      break;
    default:
      break;
  }
});

function handleRecordUpdate({ tag, payload }) {
  switch (tag) {
    case "ActiveAlert":
      getStore.dispatch({
        type: UPDATE_ALERT_INDICATOR_ITEM,
        payload
      });
      break;
    case "Filesystem":
      getStore.dispatch({
        type: UPDATE_FILESYSTEM_ITEM,
        payload
      });
      break;
    case "Host":
      getStore.dispatch({
        type: UPDATE_SERVER_ITEM,
        payload
      });
      break;
    case "LnetConfiguration":
      getStore.dispatch({
        type: UPDATE_LNET_CONFIGURATION_ITEM,
        payload
      });
      break;
    case "ManagedTargetMount":
      getStore.dispatch({
        type: UPDATE_MANAGED_TARGET_MOUNT_ITEM
      });
      break;
    case "StratagemConfig":
      getStore.dispatch({
        type: UPDATE_STRATAGEM_ITEM,
        payload
      });
      break;
    case "Target":
      getStore.dispatch({
        type: UPDATE_TARGET_ITEM,
        payload
      });
      break;
    case "Volume":
      getStore.dispatch({
        type: UPDATE_VOLUME_ITEM,
        payload
      });
      break;
    case "VolumeNode":
      getStore.dispatch({
        type: UPDATE_VOLUME_NODE_ITEM,
        payload
      });
      break;
  }
}

function handleRecordDelete({ tag, payload }) {
  switch (tag) {
    case "ActiveAlert":
      getStore.dispatch({
        type: DELETE_ALERT_INDICATOR_ITEM,
        payload
      });
      break;
    case "Filesystem":
      getStore.dispatch({
        type: DELETE_FILESYSTEM_ITEM,
        payload
      });
      break;
    case "Host":
      getStore.dispatch({
        type: DELETE_SERVER_ITEM,
        payload
      });
      break;
    case "LnetConfiguration":
      getStore.dispatch({
        type: DELETE_LNET_CONFIGURATION_ITEM,
        payload
      });
      break;
    case "ManagedTargetMount":
      getStore.dispatch({
        type: DELETE_MANAGED_TARGET_MOUNT_ITEM,
        payload
      });
      break;
    case "StratagemConfig":
      getStore.dispatch({
        type: DELETE_STRATAGEM_ITEM,
        payload
      });
      break;
    case "Target":
      getStore.dispatch({
        type: DELETE_TARGET_ITEM,
        payload
      });
      break;
    case "Volume":
      getStore.dispatch({
        type: DELETE_VOLUME_ITEM,
        payload
      });
      break;
    case "VolumeNode":
      getStore.dispatch({
        type: DELETE_VOLUME_NODE_ITEM,
        payload
      });
      break;
  }
}

function handleRecordChange({ tag, payload }) {
  switch (tag) {
    case "Update":
      handleRecordUpdate(payload);
      break;
    case "Delete":
      handleRecordDelete(payload);
      break;
  }
}
