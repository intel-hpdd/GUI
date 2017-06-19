import actionDropdownModule from '../../../../source/iml/action-dropdown/action-dropdown-module';

describe('confirm action modal', function() {
  beforeEach(module(actionDropdownModule));

  describe('confirm action modal', function() {
    let confirmAction, title, confirmPrompts;

    beforeEach(
      inject(function($rootScope, $controller) {
        const $scope = $rootScope.$new();

        title = 'The Title';
        confirmPrompts = [];

        $controller('ConfirmActionModalCtrl', {
          $scope: $scope,
          title: title,
          confirmPrompts: confirmPrompts
        });

        confirmAction = $scope.confirmAction;
      })
    );

    it('should have a title property', function() {
      expect(confirmAction.title).toEqual('The Title');
    });

    it('should set the confirmPrompts', function() {
      expect(confirmAction.confirmPrompts).toEqual([]);
    });
  });

  describe('open confirm action modal', function() {
    let $uibModal, openConfirmActionModal;

    beforeEach(
      module(function($provide) {
        $uibModal = {
          open: jasmine.createSpy('open')
        };

        $provide.value('$uibModal', $uibModal);
      })
    );

    let title, confirmPrompts;

    beforeEach(
      inject(function(_openConfirmActionModal_) {
        title = 'The title';
        confirmPrompts = [];

        openConfirmActionModal = _openConfirmActionModal_;
        openConfirmActionModal(title, confirmPrompts);
      })
    );

    it('should open the modal as expected', function() {
      expect($uibModal.open).toHaveBeenCalledOnceWith({
        templateUrl:
          'iml/action-dropdown/assets/html/confirm-action-modal.html',
        controller: 'ConfirmActionModalCtrl',
        windowClass: 'confirm-action-modal',
        backdropClass: 'confirm-action-modal-backdrop',
        backdrop: 'static',
        resolve: {
          title: expect.any(Function),
          confirmPrompts: expect.any(Function)
        }
      });
    });

    describe('resolves', function() {
      let resolve;

      beforeEach(function() {
        resolve = $uibModal.open.calls.mostRecent().args[0].resolve;
      });

      it('should set the title', function() {
        expect(resolve.title()).toEqual(title);
      });

      it('should set the confirm prompts', function() {
        expect(resolve.confirmPrompts()).toEqual([]);
      });
    });
  });
});
