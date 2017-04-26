import {
  waitUntilLoadedCtrl,
  waitUntilLoadedStep
} from '../../../../source/iml/server/wait-until-loaded-step.js';
import angular from '../../../angular-mock-setup.js';

describe('wait until add server resolves complete', () => {
  let scope, $rootScope, step;

  beforeEach(() => {
    step = waitUntilLoadedStep();
  });

  beforeEach(
    angular.mock.inject(_$rootScope_ => {
      $rootScope = _$rootScope_;
      scope = $rootScope.$new();

      waitUntilLoadedCtrl(scope);
    })
  );

  describe('Wait Until Loaded Controller', () => {
    it('should emit the closeModal event', () => {
      let closeModalCalled = false;

      $rootScope.$on(
        'addServerModal::closeModal',
        () => (closeModalCalled = true)
      );

      scope.wait.close();
      scope.$digest();

      expect(closeModalCalled).toBe(true);
    });
  });

  describe('initialize waitUntilLoadedStep', () => {
    it('should have the template', () => {
      expect(step.template).toBe(`<div class="modal-header">
  <button type="button" class="close" ng-click="wait.close()">
    <i class="fa fa-times"></i>
  </button>
  <h4 class="modal-title">{{'server_waiting_title' | insertHelp}}</h4>
  <i class="fa fa-question-circle"
     tooltip="{{'server_waiting' | insertHelp}}"
     tooltip-placement="bottom"></i>
</div>
<div class="loading-data">
  <div class="well text-center">
    <h2 class="text-center">{{'server_waiting_header' | insertHelp}}</h2>
    <p>{{'server_waiting' | insertHelp}}</p>
    <i class="fa fa-spinner fa-spin"></i>
  </div>
</div>`);
    });

    it('should have the controller specified', () => {
      expect(step.controller).toBe('WaitUntilLoadedCtrl');
    });
  });
});
