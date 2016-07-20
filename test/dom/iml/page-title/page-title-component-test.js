import Maybe from 'intel-maybe';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('page title component', () => {
  let $state, $transitions, pageTitleComponent, getResolvedData,
    $scope, $compile, template, el, link, linkIcon, destroyOnExit,
    destroyOnSuccess;

  beforeEachAsync(async function () {
    getResolvedData = jasmine.createSpy('getResolvedData');
    const mod = await mock('source/iml/page-title/page-title-component.js', {
      'source/iml/route-utils': { getResolvedData }
    });

    pageTitleComponent = mod.default;
  });

  afterEach(resetAll);

  beforeEach(module(($compileProvider, $provide) => {
    $state = {
      router: {
        globals: {
          $current: {
            name: 'app.dashboard.overview',
            data: {
              kind: 'Dashboard',
              icon: 'icon1'
            }
          }
        }
      }
    };

    destroyOnExit = jasmine.createSpy('destroyOnExit');
    destroyOnSuccess = jasmine.createSpy('destroyOnSuccess');

    $transitions = {
      onExit: jasmine.createSpy('onExit')
        .and.returnValue(destroyOnExit),
      onSuccess: jasmine.createSpy('onSuccess')
        .and.returnValue(destroyOnSuccess)
    };

    $provide.value('$state', $state);
    $provide.value('$transitions', $transitions);
    $compileProvider.component('pageTitle', pageTitleComponent);
  }));

  beforeEach(inject((_$compile_, $rootScope) => {
    $scope = $rootScope.$new();
    $compile = _$compile_;
    template = '<page-title></page-title>';
  }));

  describe('before a successful transition', () => {
    beforeEach(() => {
      getResolvedData
        .and.returnValue(Maybe.of({
          label: 'fs1',
          kind: 'Dashboard'
        }));

      el = $compile(template)($scope)[0];

      $transitions.onExit.calls.argsFor(0)[1]();

      $scope.$digest();

      link = el.querySelector.bind(el, 'h3');
      linkIcon = el.querySelector.bind(el, 'h3 > i');
    });

    it('should not display the page title', () => {
      expect(link()).toEqual(null);
    });
  });

  describe('after a successful transition', () => {
    beforeEach(() => {
      getResolvedData
        .and.returnValue(Maybe.of({
          label: 'fs1',
          kind: 'Dashboard'
        }));

      el = $compile(template)($scope)[0];

      getResolvedData
        .and.returnValue(Maybe.of({
          label: 'fs1-MDT0000',
          kind: 'Dashboard'
        }));

      const transition = {
        to: jasmine.createSpy('to')
          .and.returnValue({
            data: {
              kind: 'Dashboard',
              icon: 'icon2'
            }
          })
      };

      $transitions.onSuccess.calls.argsFor(0)[1](transition);

      $scope.$digest();

      link = el.querySelector.bind(el, 'h3');
      linkIcon = el.querySelector.bind(el, 'h3 > i');
    });

    it('should display the kind and label', () => {
      expect(link().textContent.trim()).toEqual('Dashboard : fs1-MDT0000');
    });

    it('should display the icon', () => {
      expect(linkIcon()).toHaveClass('icon2');
    });
  });

  describe('on destroy', () => {
    beforeEach(() => {
      getResolvedData
        .and.returnValue(Maybe.of({
          label: 'fs1',
          kind: 'Dashboard'
        }));

      el = $compile(template)($scope)[0];
      $scope.$digest();
      $scope.$destroy();
    });

    it('should destroy onStart', () => {
      expect(destroyOnExit).toHaveBeenCalledOnce();
      expect(destroyOnSuccess).toHaveBeenCalledOnce();
    });
  });
});
