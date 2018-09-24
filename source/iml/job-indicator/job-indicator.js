//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from "@iml/lodash-mixins";
import * as fp from "@iml/fp";

export const ADD_JOB_INDICATOR_ITEMS = "ADD_JOB_INDICATOR_ITEMS";

export default function jobStatusDirective(localApply) {
  "ngInject";
  return {
    scope: {
      recordId: "=",
      jobStream: "="
    },
    restrict: "E",
    link: function link(scope) {
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

      const mapLockedItemUri = fp.map(x => x.locked_item_uri);
      const mapDescription = fp.map(x => x.description);

      const calculateLocks = type => s => {
        const hasMatchingRecord = fp.flow(
          x => x[`${type}_locks`],
          mapLockedItemUri,
          fp.some(fp.eq(scope.recordId))
        );
        const findMatchingRecords = fp.filter(hasMatchingRecord);

        const xForm = fp.flow(
          findMatchingRecords,
          mapDescription,
          x => {
            //this is in a closure because we want to access messages at call time not define time.
            scope[type + "MessageDifference"] = fp.difference(scope[type + "Messages"])(x);

            return x;
          },
          x => (scope[type + "Messages"] = x)
        );

        s.map(xForm).each(localApply.bind(null, scope));
      };

      let readViewer = scope.jobStream();
      let writeViewer = scope.jobStream();

      readViewer.through(calculateLocks("read"));
      writeViewer.through(calculateLocks("write"));

      scope.$on("$destroy", function onDestroy() {
        readViewer.destroy();
        writeViewer.destroy();
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
