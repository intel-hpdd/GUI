// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { getReadLocks, getWriteLocks, getLocksDiff, type GetTypeLocksT } from "../locks/locks-utils.js";

import { type LockT } from "../locks/locks-reducer.js";

export const ADD_JOB_INDICATOR_ITEMS = "ADD_JOB_INDICATOR_ITEMS";

const pluralize = (count: number, stringMap: { "1": string, other: string }) => {
  const msg = stringMap[count] || stringMap.other || "";
  return msg.replace("{}", count.toString());
};

export default {
  bindings: {
    recordId: "<",
    contentTypeId: "<",
    locks: "<"
  },
  controller() {
    let isOpened = false;

    Object.assign(this, {
      closeOthers: false,
      openWrite: true,
      openRead: true,
      readMessages: [],
      readMessageDifference: [],
      writeMessages: [],
      writeMessageDifference: [],
      locks: this.locks || [],
      onToggle: function onToggle(state) {
        if (state === "closed") {
          this.clearMessageRecords();
          isOpened = false;
        } else if (state === "opened") {
          isOpened = true;
        }
      },
      clearMessageRecords: function clearMessageRecords() {
        this.readMessageDifference.length = 0;
        this.writeMessageDifference.length = 0;
      },
      shouldShowLockIcon: function shouldShowLockIcon() {
        return this.writeMessages.length + this.readMessages.length > 0 || isOpened;
      },
      getLockTooltipMessage: function getLockTooltipMessage() {
        const readMessages = this.readMessages;
        const writeMessages = this.writeMessages;
        let message = "";
        let writeMessageMap, readMessageMap;

        if (writeMessages.length > 0 && readMessages.length > 0) {
          writeMessageMap = {
            "1": "There is 1 ongoing write lock operation and ",
            other: "There are {} ongoing write lock operations and "
          };
          const writeMessage = pluralize(writeMessages.length, writeMessageMap);

          readMessageMap = {
            "1": "1 pending read lock operation.",
            other: "{} pending read lock operations."
          };
          const readMessage = pluralize(readMessages.length, readMessageMap);

          message = writeMessage + readMessage + " Click to review details.";
        } else if (writeMessages.length > 0) {
          writeMessageMap = {
            "1": "1 ongoing write lock operation.",
            other: "{} ongoing write lock operations."
          };
          message = pluralize(writeMessages.length, writeMessageMap) + " Click to review details.";
        } else if (readMessages.length > 0) {
          readMessageMap = {
            "1": "Locked by 1 pending operation.",
            other: "Locked by {} pending operations."
          };
          message = pluralize(readMessages.length, readMessageMap) + " Click to review details.";
        }

        return message;
      },
      $onChanges: (changesObj: { locks: { previousValue: LockT, currentValue: LockT } }) => {
        if (!changesObj.locks || !changesObj.locks.currentValue || this.contentTypeId == null || this.recordId == null)
          return;

        const locks = changesObj.locks.currentValue;
        const calculateLocks = (locks: LockT) => (type: string, getLocks: GetTypeLocksT) => {
          const messages = getLocks(this.contentTypeId, this.recordId, locks).map(x => x.description);

          this[`${type}MessageDifference`] = getLocksDiff(
            this[`${type}Messages`],
            messages,
            this[`${type}MessageDifference`]
          );
          this[`${type}Messages`] = messages;
        };

        const calculateLockItems = calculateLocks(locks);
        calculateLockItems("read", getReadLocks);
        calculateLockItems("write", getWriteLocks);
      }
    });
  },
  template: `<span class="job-status">
    <i class="fa fa-lock tooltip-container tooltip-hover activate-popover"
     ng-show="$ctrl.shouldShowLockIcon()">
       <iml-tooltip size="'large'" direction="right">
         <span>{{$ctrl.getLockTooltipMessage()}}</span>
       </iml-tooltip>
    </i>
  <iml-popover placement="bottom" title="Job Operations" on-toggle="$ctrl.onToggle(state)">
    <accordion close-others="$ctrl.closeOthers">
      <accordion-group heading="Write Operations" ng-if="$ctrl.writeMessages.length > 0 ||
      $ctrl.writeMessageDifference.length > 0" is-open="$ctrl.openWrite">
        <ul>
          <li ng-repeat="message in $ctrl.writeMessages">{{message}}</li>
          <li ng-repeat="message in $ctrl.writeMessageDifference"><s>{{message}}</s></li>
        </ul>
      </accordion-group>
      <accordion-group heading="Read Operations" ng-if="$ctrl.readMessages.length > 0 ||
      $ctrl.readMessageDifference" is-open="$ctrl.openRead">
        <ul>
          <li ng-repeat="message in $ctrl.readMessages">{{message}}</li>
          <li ng-repeat="message in $ctrl.readMessageDifference"><s>{{message}}</s></li>
        </ul>
      </accordion-group>
    </accordion>
  </iml-popover>
</span>`
};
