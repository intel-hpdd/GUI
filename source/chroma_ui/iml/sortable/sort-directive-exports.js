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

import angular from 'angular';



export function sorter () {
  const CLASS_NAMES = {
    OVERLAY: 'sort-overlay',
    SORTING: 'sorting',
    OVER: 'over'
  };

  const sortOverlay = document.createElement('div');
  sortOverlay.className = CLASS_NAMES.OVERLAY;

  return {
    restrict: 'A',
    scope: {},
    controller: function ($element, $scope) {
      'ngInject';

      var self = this;

      this._sortItems = [];

      this.addSortItem = function addSortItem (item) {
        this._sortItems.push(item);
      };

      this.dragStart = function dragStart () {
        $element.addClass(CLASS_NAMES.SORTING);

        self._sortItems.forEach(function (item) {
          const overlay = angular.element(sortOverlay.cloneNode()).appendTo(item)[0];

          overlay.addEventListener('dragenter', dragEnter, false);

          overlay.addEventListener('dragover', dragOver, false);

          overlay.addEventListener('dragleave', dragLeave, false);

          overlay.addEventListener('drop', drop, false);
        });
      };

      this.dragEnd = function dragEnd () {
        $element.removeClass(CLASS_NAMES.SORTING);
      };

      function dragEnter (event) {
        // jshint validthis: true
        angular.element(this).addClass(CLASS_NAMES.OVER);

        if (event.preventDefault) event.preventDefault();

        return false;
      }

      function dragOver (event) {
        event.dataTransfer.dropEffect = 'move';

        if (event.preventDefault) event.preventDefault();

        return false;
      }

      function dragLeave () {
        // jshint validthis: true
        angular.element(this).removeClass(CLASS_NAMES.OVER);
      }

      function drop (event) {
        $scope.$apply(function () {
          var dropNode = event.target.parentNode;
          var container = dropNode.parentNode;

          var dropIndex = [].indexOf.call(container.children, dropNode);
          var dragIndex = parseInt(event.dataTransfer.getData('text'), 10);

          var dragNode = [].slice.call(container.children, dragIndex, dragIndex + 1).pop();

          if (dragIndex > dropIndex)
            container.insertBefore(dragNode, dropNode);
          else
            container.insertBefore(dragNode, dropNode.nextSibling);

          $element.find('.' + CLASS_NAMES.OVERLAY).each(function () {
            this.removeEventListener('dragenter', dragEnter, false);

            this.removeEventListener('dragover', dragOver, false);

            this.removeEventListener('dragleave', dragLeave, false);

            this.removeEventListener('drop', drop, false);
          }).remove();
        });

        if (event.stopPropagation) event.stopPropagation();
        event.preventDefault();

        return false;
      }

      $scope.$on('$destroy', function () {
        self._sortItems = null;
      });
    }
  };
}

export function sortItem () {
  return {
    restrict: 'A',
    require: '^sorter',
    link: function link (scope, wrappedEl, attrs, sortContainerCtrl) {
      var el = wrappedEl[0];

      sortContainerCtrl.addSortItem(wrappedEl);

      wrappedEl.attr('draggable', true);

      el.addEventListener('dragstart', dragStart, false);

      el.addEventListener('dragend', sortContainerCtrl.dragEnd, false);

      scope.$on('$destroy', function () {
        el.removeEventListener('dragstart', dragStart, false);
        el.removeEventListener('dragend', sortContainerCtrl.dragEnd, false);

        el = wrappedEl = null;
      });

      function dragStart (event) {
        sortContainerCtrl.dragStart();

        var index = [].indexOf.call(event.target.parentNode.children, event.target);

        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text', index.toString());
      }
    }
  };
}
