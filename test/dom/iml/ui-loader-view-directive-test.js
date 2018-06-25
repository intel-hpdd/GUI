import angular from '../../angular-mock-setup.js';

describe('ui loader view directive', () => {
  let mod, t, $transitions, $animate, onStartDestructor;
  beforeEach(() => {
    mod = require('../../../source/iml/ui-loader-view-directive.js');
  });
  beforeEach(
    angular.mock.module(($compileProvider, $provide) => {
      onStartDestructor = jest.fn();
      t = { from: jest.fn(), to: jest.fn() };
      $transitions = { onStart: jest.fn(() => onStartDestructor) };
      $provide.value('$transitions', $transitions);
      $animate = {
        leave: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
        addClass: jest.fn((x, y) => {
          x[0].classList.add(y);
        }),
        removeClass: jest.fn((x, y) => {
          x[0].classList.remove(y);
        })
      };
      $provide.value('$animate', $animate);
      $compileProvider.directive('uiLoaderView', mod.default);
    })
  );

  let el,
    $scope,
    $scope2,
    $scope3,
    $compile,
    uiView,
    appView,
    subView,
    uiLoaderRootView,
    uiLoaderAppView,
    uiLoaderSubView,
    uiLoaderAppViewContainer;
  beforeEach(
    angular.mock.inject((_$compile_, $rootScope) => {
      $compile = _$compile_;
      $scope = $rootScope.$new();
      $scope2 = $rootScope.$new();
      $scope3 = $rootScope.$new();
      const template = ` <div> <ui-loader-view load-once="true"></ui-loader-view> </div> `;
      el = $compile(template)($scope)[0];
      $scope.$digest();
      uiLoaderRootView = el.querySelector('ui-loader-view');
      uiView = el.querySelector('[ui-view]');
    })
  );
  describe('loading the page', () => {
    beforeEach(() => {
      t.from.mockReturnValue({ name: '' });
      t.to.mockReturnValue({ name: 'app.dashboard' });
      $transitions.onStart.mock.calls[0][1](t);
      $scope.$digest();
    });
    it('should call $animate.leave on the parent', () => {
      expect($animate.leave).toHaveBeenCalledOnceWith(uiView);
    });
    it('should put "waiting" class on uiLoaderView', () => {
      expect(uiLoaderRootView.classList.contains('waiting')).toBe(true);
    });
    describe('transitioning to a new page', () => {
      beforeEach(() => {
        $animate.on.mock.calls[0][2](createElementSpy(uiView), 'start');
        uiLoaderAppViewContainer = document.createElement('div');
        uiLoaderAppView = document.createElement('ui-loader-view');
        uiLoaderAppViewContainer.appendChild(uiLoaderAppView);
        uiView.appendChild(uiLoaderAppViewContainer);
        $compile(uiLoaderAppViewContainer)($scope2);
        appView = uiLoaderAppView.querySelector('[ui-view]');
        uiLoaderSubView = document.createElement('ui-loader-view');
        appView.appendChild(uiLoaderSubView);
        $compile(uiLoaderSubView)($scope3);
        subView = uiLoaderSubView.querySelector('[ui-view]');
        t.from.mockReturnValue({ name: 'app.dashboard.overview' });
        t.to.mockReturnValue({ name: 'app.server' });
        $transitions.onStart.mock.calls[1][1](t);
        $transitions.onStart.mock.calls[2][1](t);
        $scope.$digest();
        $scope2.$digest();
        $scope3.$digest();
      });
      it('should not call $animate.leave on the root loader a second time', () => {
        expect($animate.leave).toHaveBeenCalledOnceWith(uiView);
      });
      it('should not add the "waiting" class to the root loader', () => {
        expect(uiLoaderRootView.classList.contains('waiting')).toBe(false);
      });
      it('should call $animate.leave on the app view', () => {
        expect($animate.leave).toHaveBeenCalledOnceWith(appView);
      });
      it('should add "waiting" class on the app view', () => {
        expect(uiLoaderAppView.classList.contains('waiting')).toBe(true);
      });
      it('should not call $animate.leave on the sub view', () => {
        expect($animate.leave).not.toHaveBeenCalledOnceWith(subView);
      });
      it('should not add "waiting" class on the sub view', () => {
        expect(uiLoaderSubView.classList.contains('waiting')).toBe(false);
      });
      describe('after completing the transition', () => {
        beforeEach(() => {
          $animate.on.mock.calls[1][2](createElementSpy(appView), 'start');
          $animate.on.mock.calls[2][2](createElementSpy(subView), 'start');
          $scope.$digest();
          $scope2.$digest();
          $scope3.$digest();
        });
        it('should not have a "waiting" class to the root loader', () => {
          expect(uiLoaderRootView.classList.contains('waiting')).toBe(false);
        });
        it('should not have a "waiting" class on appView parent', () => {
          expect(uiLoaderAppViewContainer.classList.contains('waiting')).toBe(false);
        });
        it('should not have a "waiting" class on the app view', () => {
          expect(uiLoaderAppView.classList.contains('waiting')).toBe(false);
        });
        it('should not have a "waiting" class on the sub view', () => {
          expect(uiLoaderSubView.classList.contains('waiting')).toBe(false);
        });
      });
    });
    describe('transitioning to a new state within the same page', () => {
      beforeEach(() => {
        $animate.on.mock.calls[0][2](createElementSpy(uiView), 'start');
        uiLoaderAppViewContainer = document.createElement('div');
        uiLoaderAppView = document.createElement('ui-loader-view');
        uiLoaderAppViewContainer.appendChild(uiLoaderAppView);
        uiView.appendChild(uiLoaderAppViewContainer);
        $compile(uiLoaderAppViewContainer)($scope2);
        appView = uiLoaderAppView.querySelector('[ui-view]');
        uiLoaderSubView = document.createElement('ui-loader-view');
        appView.appendChild(uiLoaderSubView);
        $compile(uiLoaderSubView)($scope3);
        subView = uiLoaderSubView.querySelector('[ui-view]');
        t.from.mockReturnValue({ name: 'app.dashboard.overview' });
        t.to.mockReturnValue({ name: 'app.dashboard.server' });
        $transitions.onStart.mock.calls[1][1](t);
        $transitions.onStart.mock.calls[2][1](t);
        $scope.$digest();
        $scope2.$digest();
        $scope3.$digest();
      });
      it('should not call $animate.leave on the root loader a second time', () => {
        expect($animate.leave).toHaveBeenCalledOnceWith(uiView);
      });
      it('should not add the "waiting" class to the root loader', () => {
        expect(uiLoaderRootView.classList.contains('waiting')).toBe(false);
      });
      it('should not call $animate.leave on the app view', () => {
        expect($animate.leave).not.toHaveBeenCalledOnceWith(appView);
      });
      it('should not add "waiting" class on the app view', () => {
        expect(uiLoaderAppView.classList.contains('waiting')).toBe(false);
      });
      it('should call $animate.leave on the sub view', () => {
        expect($animate.leave).toHaveBeenCalledOnceWith(subView);
      });
      it('should add "waiting" class on the sub view', () => {
        expect(uiLoaderSubView.classList.contains('waiting')).toBe(true);
      });
      describe('after completing the transition', () => {
        beforeEach(() => {
          $animate.on.mock.calls[1][2](createElementSpy(appView), 'start');
          $animate.on.mock.calls[2][2](createElementSpy(subView), 'start');
          $scope.$digest();
          $scope2.$digest();
          $scope3.$digest();
        });
        it('should not have a "waiting" class to the root loader', () => {
          expect(uiLoaderRootView.classList.contains('waiting')).toBe(false);
        });
        it('should not have a "waiting" class on appView parent', () => {
          expect(uiLoaderAppViewContainer.classList.contains('waiting')).toBe(false);
        });
        it('should not have a "waiting" class on the app view', () => {
          expect(uiLoaderAppView.classList.contains('waiting')).toBe(false);
        });
        it('should not have a "waiting" class on the sub view', () => {
          expect(uiLoaderSubView.classList.contains('waiting')).toBe(false);
        });
      });
    });
    describe('destroying the directive', () => {
      beforeEach(() => {
        $scope.$destroy();
      });
      it('should clear the onStart transition listener', () => {
        expect(onStartDestructor).toHaveBeenCalledTimes(1);
      });
      it('should call $animate.off', () => {
        expect($animate.off).toHaveBeenCalledOnceWith('enter', uiLoaderRootView);
      });
    });
  });
});
function createElementSpy(itemToReturn) {
  return { get: jest.fn(() => itemToReturn), 0: itemToReturn };
}
