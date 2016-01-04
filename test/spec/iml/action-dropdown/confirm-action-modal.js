import angular from 'angular';
const {module, inject} = angular.mock;

describe('confirm action modal', function () {
  'use strict';

  beforeEach(module('action-dropdown-module'));

  describe('confirm action modal', function () {
    var confirmAction, title, confirmPrompts;

    beforeEach(inject(function ($rootScope, $controller) {
      var $scope = $rootScope.$new();

      title = 'The Title';
      confirmPrompts = [];

      $controller('ConfirmActionModalCtrl', {
        $scope: $scope,
        title: title,
        confirmPrompts: confirmPrompts
      });

      confirmAction = $scope.confirmAction;
    }));

    it('should have a title property', function () {
      expect(confirmAction.title).toEqual('The Title');
    });

    it('should set the confirmPrompts', function () {
      expect(confirmAction.confirmPrompts).toEqual([]);
    });
  });

  describe('open confirm action modal', function () {
    var $modal, openConfirmActionModal;

    beforeEach(module(function ($provide) {
      $modal = {
        open: jasmine.createSpy('open')
      };

      $provide.value('$modal', $modal);
    }));

    var title, confirmPrompts;

    beforeEach(inject(function (_openConfirmActionModal_) {
      title = 'The title';
      confirmPrompts = [];

      openConfirmActionModal = _openConfirmActionModal_;
      openConfirmActionModal(title, confirmPrompts);
    }));

    it('should open the modal as expected', function () {
      expect($modal.open).toHaveBeenCalledOnceWith({
        templateUrl: 'iml/action-dropdown/assets/html/confirm-action-modal.html',
        controller: 'ConfirmActionModalCtrl',
        windowClass: 'confirm-action-modal',
        backdropClass: 'confirm-action-modal-backdrop',
        backdrop: 'static',
        resolve: {
          title: jasmine.any(Function),
          confirmPrompts: jasmine.any(Function)
        }
      });
    });

    describe('resolves', function () {
      var resolve;

      beforeEach(function () {
        resolve = $modal.open.calls.mostRecent().args[0].resolve;
      });

      it('should set the title', function () {
        expect(resolve.title()).toEqual(title);
      });

      it('should set the confirm prompts', function () {
        expect(resolve.confirmPrompts()).toEqual([]);
      });
    });
  });
});
