import {
  mock,
  resetAll
} from '../../../system-mock.js';


describe('wait until add server resolves complete', () => {
  let waitUntilLoadedStep,
    waitUntilLoadedCtrl,
    scope,
    $rootScope;

  beforeEachAsync(async function () {
    const mod = await mock('source/iml/server/wait-until-loaded-step.js', {
      'source/iml/server/assets/html/wait-until-loaded-step.html!text': {
        default: 'waitUntilLoadedTemplate'
      }
    });

    waitUntilLoadedCtrl = mod.waitUntilLoadedCtrl;
    waitUntilLoadedStep = mod.waitUntilLoadedStep();
  });

  afterEach(resetAll);

  beforeEach(inject(_$rootScope_ => {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();

    waitUntilLoadedCtrl(scope);
  }));

  describe('Wait Until Loaded Controller', () => {

    it('should emit the closeModal event', () => {
      let closeModalCalled = false;

      $rootScope
        .$on(
          'addServerModal::closeModal',
          () => closeModalCalled = true
        );

      scope.wait.close();
      scope.$digest();

      expect(closeModalCalled)
        .toBe(true);
    });
  });

  describe('initialize waitUntilLoadedStep', () => {
    it('should have the template', () => {
      expect(waitUntilLoadedStep.template)
        .toBe('waitUntilLoadedTemplate');
    });

    it('should have the controller specified', () => {
      expect(waitUntilLoadedStep.controller).toBe('WaitUntilLoadedCtrl');
    });
  });
});
