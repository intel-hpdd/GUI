// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from "@iml/lodash-mixins";
import * as fp from "@iml/fp";

import { type LockT, type ReadOrWriteT, type LockToLockEntries } from "../locks/locks-reducer.js";
import type { HighlandStreamT } from "highland";
import type { localApplyT } from "../extend-scope-module.js";
import type { $scopeT } from "angular";

export const ADD_JOB_INDICATOR_ITEMS = "ADD_JOB_INDICATOR_ITEMS";

type JobStatusScope = $scopeT & {|
  recordId: number,
  contentTypeId: number,
  jobStream: () => HighlandStreamT<LockT>,
  closeOthers: boolean,
  openWrite: boolean,
  openRead: boolean,
  readMessages: string[],
  readMessageDifference: string[],
  writeMessages: string[],
  writeMessageDifference: string[],
  onToggle: (state: "closed" | "opened") => void,
  clearMessageRecords: () => void,
  shouldShowLockIcon: () => boolean,
  getLockTooltipMessage: () => string
|};

export default function jobStatusDirective(localApply: localApplyT<*>) {
  "ngInject";
  return {
    scope: {
      recordId: "=",
      contentTypeId: "=",
      jobStream: "="
    },
    restrict: "E",
    link: function link(scope: JobStatusScope) {
      let isOpened = false;

      Object.assign(scope, {
        closeOthers: false,
        openWrite: true,
        openRead: true,
        readMessages: [],
        readMessageDifference: [],
        writeMessages: [],
        writeMessageDifference: [],
        onToggle: function onToggle(state) {
          if (state === "closed") {
            scope.clearMessageRecords();
            isOpened = false;
          } else if (state === "opened") {
            isOpened = true;
          }
        },
        clearMessageRecords: function clearMessageRecords() {
          scope.readMessageDifference.length = 0;
          scope.writeMessageDifference.length = 0;
        },
        shouldShowLockIcon: function shouldShowLockIcon() {
          return scope.writeMessages.length + scope.readMessages.length > 0 || isOpened;
        },
        getLockTooltipMessage: function getLockTooltipMessage() {
          const readMessages = scope.readMessages;
          const writeMessages = scope.writeMessages;
          let message = "";
          let writeMessageMap, readMessageMap;

          if (writeMessages.length > 0 && readMessages.length > 0) {
            writeMessageMap = {
              "1": "There is 1 ongoing write lock operation and ",
              other: "There are {} ongoing write lock operations and "
            };
            const writeMessage = _.pluralize(writeMessages.length, writeMessageMap);

            readMessageMap = {
              "1": "1 pending read lock operation.",
              other: "{} pending read lock operations."
            };
            const readMessage = _.pluralize(readMessages.length, readMessageMap);

            message = writeMessage + readMessage + " Click to review details.";
          } else if (writeMessages.length > 0) {
            writeMessageMap = {
              "1": "1 ongoing write lock operation.",
              other: "{} ongoing write lock operations."
            };
            message = _.pluralize(writeMessages.length, writeMessageMap) + " Click to review details.";
          } else if (readMessages.length > 0) {
            readMessageMap = {
              "1": "Locked by 1 pending operation.",
              other: "Locked by {} pending operations."
            };
            message = _.pluralize(readMessages.length, readMessageMap) + " Click to review details.";
          }

          return message;
        }
      });

      const mapDescription = fp.map(x => x.description);

      const calculateLocks = (type: ReadOrWriteT) => (s: HighlandStreamT<LockT>) => {
        const xForm = fp.flow(
          mapDescription,
          x => {
            //this is in a closure because we want to access messages at call time not define time.
            scope[type + "MessageDifference"] = fp.difference(scope[type + "Messages"])(x);

            return x;
          },
          x => (scope[type + "Messages"] = x)
        );

        const flattenLocks: LockToLockEntries = ({ ...xs }) => ([].concat(...Object.values(xs)): any);
        return s
          .map(flattenLocks)
          .map(
            fp.filter(
              ({ ...x }) =>
                x.lock_type === type && x.content_type_id === scope.contentTypeId && x.item_id === scope.recordId
            )
          )
          .map(xForm)
          .each(() => localApply(scope));
      };

      let readViewer = scope.jobStream();
      let writeViewer = scope.jobStream();

      readViewer.through(calculateLocks("read"));
      writeViewer.through(calculateLocks("write"));

      scope.$on("$destroy", function onDestroy() {
        if (readViewer != null) readViewer.destroy();
        if (writeViewer != null) writeViewer.destroy();
        readViewer = writeViewer = null;
      });
    },
    template: `<span class="job-status">
    <i class="fa fa-lock tooltip-container tooltip-hover activate-popover"
     ng-show="shouldShowLockIcon()">
       <iml-tooltip size="'large'" direction="right">
         <span>{{getLockTooltipMessage()}}</span>
       </iml-tooltip>
    </i>
  <iml-popover placement="bottom" title="Job Operations" on-toggle="onToggle(state)">
    <accordion close-others="closeOthers">
      <accordion-group heading="Write Operations" ng-if="writeMessages.length > 0 ||
      writeMessageDifference.length > 0" is-open="openWrite">
        <ul>
          <li ng-repeat="message in writeMessages">{{message}}</li>
          <li ng-repeat="message in writeMessageDifference"><s>{{message}}</s></li>
        </ul>
      </accordion-group>
      <accordion-group heading="Read Operations" ng-if="readMessages.length > 0 ||
      readMessageDifference" is-open="openRead">
        <ul>
          <li ng-repeat="message in readMessages">{{message}}</li>
          <li ng-repeat="message in readMessageDifference"><s>{{message}}</s></li>
        </ul>
      </accordion-group>
    </accordion>
  </iml-popover>
</span>`
  };
}
