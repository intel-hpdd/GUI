import {
  mock,
  resetAll
} from '../../system-mock.js';

describe('loading component', () => {
  let mod,
    t,
    $transitions,
    onStartDestructor,
    onSuccessDestructor;

  beforeEachAsync(async function () {
    mod = await mock('source/iml/loading-components.js', {});
  });

  afterEach(resetAll);

  beforeEach(module(($compileProvider, $provide) => {
    onStartDestructor = jasmine.createSpy('onStartDestructor');
    onSuccessDestructor = jasmine.createSpy('onSuccessDestructor');

    t = {
      from: jasmine
        .createSpy('from')
        .and
        .returnValue({}),
      to: jasmine
        .createSpy('to')
        .and
        .returnValue({})
    };

    $transitions = {
      onStart: jasmine
        .createSpy('onStart')
        .and
        .returnValue(onStartDestructor),
      onSuccess: jasmine
        .createSpy('onSuccess')
        .and
        .returnValue(onSuccessDestructor)
    };

    $provide.value('$transitions', $transitions);

    $compileProvider.component('uiLoaderViewRoot', mod.uiLoaderViewRootComponent);
    $compileProvider.directive('uiLoaderView', mod.uiLoaderViewDirective);
  }));

  let el, $scope;

  beforeEach(inject(($compile, $rootScope) => {
    $scope = $rootScope.$new();
    const template = `
      <ui-loader-view-root>
        <ui-loader-view load-once="true"></ui-loader-view>
      </ui-loader-view-root>
    `;

    el = $compile(template)($scope)[0];
    $scope.$digest();
    $transitions
      .onStart
      .calls
      .mostRecent()
      .args[1](t);
    $scope.$digest();
  }));

  it('should register with onStart', () => {
    expect($transitions.onStart)
      .toHaveBeenCalledOnceWith({}, jasmine.any(Function));
  });

  it('should register with onSuccess', () => {
    expect($transitions.onSuccess)
      .toHaveBeenCalledOnceWith({}, jasmine.any(Function));
  });

  it('should deregister onStart', () => {
    $scope.$destroy();

    expect(onStartDestructor)
      .toHaveBeenCalledOnce();
  });

  it('should deregister onSuccess', () => {
    $scope.$destroy();

    expect(onSuccessDestructor)
      .toHaveBeenCalledOnce();
  });

  it('should show the loading spinner', () => {
    expect(el.querySelector('.spinner-container'))
      .toBeShown();
  });

  it('should hide the content', () => {
    expect(el.querySelector('.loader-content'))
      .not
      .toBeShown();
  });

  describe('on success', () => {
    beforeEach(() => {
      $transitions
        .onSuccess
        .calls
        .mostRecent()
        .args[1](t);
      $scope.$digest();
    });

    it('should show the loading spinner', () => {
      expect(el.querySelector('.spinner-container'))
        .not
        .toBeShown();
    });

    it('should hide the content', () => {
      expect(el.querySelector('.loader-content'))
        .toBeShown();
    });
  });
});
