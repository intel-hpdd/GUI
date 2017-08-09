import angular from '../../../angular-mock-setup.js';

import helpMapperModule from '../../../../source/iml/help-mapper/help-mapper-module.js';

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
        onSuccess: jest.fn()
      };

      $provide.value('$transitions', $transitions);
      $provide.value('$state', $state);
    })
  );

  let el, $scope;

  beforeEach(
    angular.mock.inject(($compile, $rootScope) => {
      $scope = $rootScope.$new();

      const template = '<li help-mapper></li>';
      el = $compile(template)($scope)[0];
      $rootScope.$digest();
    })
  );

  it('should append an anchor', () => {
    expect(el.querySelector('a')).not.toBeNull();
  });

  it('should not end with /help/', () => {
    expect(el.querySelector('a').getAttribute('ng-href')).toBe('/help/');
  });

  it('should end with a path plus hash on matching route change', () => {
    const fn = $transitions.onSuccess.mock.calls[0][1];

    fn({
      router: {
        globals: {
          $current: {
            data: {
              helpPage: 'Graphical_User_Interface_9_0.html#9.3.1'
            }
          }
        }
      }
    });

    $scope.$digest();

    expect(el.querySelector('a').getAttribute('ng-href')).toBe(
      '/help/docs/Graphical_User_Interface_9_0.html#9.3.1'
    );
  });
});
