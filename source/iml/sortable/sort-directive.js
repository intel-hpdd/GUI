//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';

export function sorter() {
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
    controller: function($element, $scope) {
      'ngInject';
      const self = this;

      this._sortItems = [];

      this.addSortItem = function addSortItem(item) {
        this._sortItems.push(item);
      };

      this.dragStart = function dragStart() {
        $element.addClass(CLASS_NAMES.SORTING);

        self._sortItems.forEach(function(item) {
          const overlay = sortOverlay.cloneNode();
          item.append(overlay);

          overlay.addEventListener('dragenter', dragEnter, false);

          overlay.addEventListener('dragover', dragOver, false);

          overlay.addEventListener('dragleave', dragLeave, false);

          overlay.addEventListener('drop', drop, false);
        });
      };

      this.dragEnd = function dragEnd() {
        $element.removeClass(CLASS_NAMES.SORTING);
      };

      function dragEnter(event) {
        // jshint validthis: true
        angular.element(this).addClass(CLASS_NAMES.OVER);

        if (event.preventDefault) event.preventDefault();

        return false;
      }

      function dragOver(event) {
        event.dataTransfer.dropEffect = 'move';

        if (event.preventDefault) event.preventDefault();

        return false;
      }

      function dragLeave() {
        // jshint validthis: true
        angular.element(this).removeClass(CLASS_NAMES.OVER);
      }

      function drop(event) {
        $scope.$apply(function() {
          const dropNode = event.target.parentNode;
          const container = dropNode.parentNode;

          const dropIndex = [].indexOf.call(container.children, dropNode);
          const dragIndex = parseInt(event.dataTransfer.getData('text'), 10);

          const dragNode = [].slice
            .call(container.children, dragIndex, dragIndex + 1)
            .pop();

          if (dragIndex > dropIndex) container.insertBefore(dragNode, dropNode);
          else container.insertBefore(dragNode, dropNode.nextSibling);

          $element[0].querySelectorAll(`.${CLASS_NAMES.OVERLAY}`).forEach(x => {
            x.removeEventListener('dragenter', dragEnter, false);

            x.removeEventListener('dragover', dragOver, false);

            x.removeEventListener('dragleave', dragLeave, false);

            x.removeEventListener('drop', drop, false);

            x.parentNode.removeChild(x);
          });
        });

        if (event.stopPropagation) event.stopPropagation();
        event.preventDefault();

        return false;
      }

      $scope.$on('$destroy', function() {
        self._sortItems = null;
      });
    }
  };
}

export function sortItem() {
  return {
    restrict: 'A',
    require: '^sorter',
    link: function link(scope, wrappedEl, attrs, sortContainerCtrl) {
      let el = wrappedEl[0];

      sortContainerCtrl.addSortItem(wrappedEl);

      wrappedEl.attr('draggable', true);

      el.addEventListener('dragstart', dragStart, false);

      el.addEventListener('dragend', sortContainerCtrl.dragEnd, false);

      scope.$on('$destroy', function() {
        el.removeEventListener('dragstart', dragStart, false);
        el.removeEventListener('dragend', sortContainerCtrl.dragEnd, false);

        el = (wrappedEl = null);
      });

      function dragStart(event) {
        sortContainerCtrl.dragStart();

        const index = [].indexOf.call(
          event.target.parentNode.children,
          event.target
        );

        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text', index.toString());
      }
    }
  };
}
