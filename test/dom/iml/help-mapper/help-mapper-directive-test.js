import angular from '../../../angular-mock-setup.js';

import helpMapperModule
  from '../../../../source/iml/help-mapper/help-mapper-module.js';

describe('help mapper', () => {
  let $state, $transitions;

  beforeEach(
    angular.mock.module(helpMapperModule, $provide => {
      $state = {
        $current: {
          data: {}
        }
      };

      $transitions = {
        onSuccess: jasmine.createSpy('onSuccess')
      };

      $provide.value('$transitions', $transitions);
      $provide.value('$state', $state);
    })
  );

  let el, $scope;

  beforeEach(
    inject(($compile, $rootScope) => {
      $scope = $rootScope.$new();

      const template = '<li help-mapper></li>';
      el = $compile(template)($scope)[0];
      $rootScope.$digest();
    })
  );

  it('should append an anchor', () => {
    expect(el.querySelector('a')).not.toBeNull();
  });

  it('should not end with a qs', () => {
    expect(el.querySelector('a').getAttribute('ng-href')).toBe(
      '/static/webhelp/'
    );
  });

  it('should end with a qs on matching route change', () => {
    const fn = $transitions.onSuccess.calls.mostRecent().args[1];

    fn({
      router: {
        globals: {
          $current: {
            data: {
              helpPage: 'server_tab.htm'
            }
          }
        }
      }
    });

    $scope.$digest();

    expect(el.querySelector('a').getAttribute('ng-href')).toBe(
      '/static/webhelp/?server_tab.htm'
    );
  });
});
