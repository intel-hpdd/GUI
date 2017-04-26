import highland from 'highland';

import { mock, resetAll } from '../../../system-mock.js';

describe('user subscriptions component', () => {
  let mod, socketStream, socket$;

  beforeEachAsync(async function() {
    socketStream = jasmine
      .createSpy('socketStream')
      .and.callFake(() => (socket$ = highland()));

    mod = await mock('source/iml/user/user-subscriptions-component.js', {
      'source/iml/socket/socket-stream.js': {
        default: socketStream
      }
    });
  });

  afterEach(resetAll);

  beforeEach(
    module(
      'extendScope',
      'bigDifferModule',
      'configToggle',
      'multiToggler',
      ($provide, $compileProvider) => {
        $provide.value(
          'insertHelpFilter',
          jasmine.createSpy('insertHelpFilter')
        );
        $compileProvider.component('userSubscriptions', mod.default);
      }
    )
  );

  let el, $scope;

  beforeEach(
    inject(($compile: $compileT, $rootScope: $scopeT) => {
      $scope = $rootScope.$new();

      $scope.subscriptions = [
        {
          description: 'Alert event',
          resource_uri: '/api/alert_type/24/',
          selected: true,
          sub_uri: '/api/alert_subscription/45/'
        },
        {
          description: 'Syslog event',
          resource_uri: '/api/alert_type/26/',
          selected: false
        }
      ];
      $scope.resourceUri = '/api/user/2';

      const template =
        '<user-subscriptions resource-uri="resourceUri" subscriptions="subscriptions"></user-subscriptions>';
      el = $compile(template)($scope)[0];
      $scope.$digest();
    })
  );

  it('should have a header', () => {
    expect(el.querySelector('.section-header')).toHaveText('Notifications');
  });

  it('should show the configure button', () => {
    expect(el.querySelector('.edit-btn')).not.toBeNull();
  });

  it('should show the list of choices', () => {
    const labels = Array.from(el.querySelectorAll('.sub-label')).map(
      x => x.textContent
    );

    expect(labels).toEqual(['Alert event:', 'Syslog event:']);
  });

  it('should not show the saving banner', () => {
    expect(el.querySelector('.alert-info')).toBeNull();
  });

  describe('configuring', () => {
    beforeEach(() => {
      el.querySelector('.edit-btn').click();
    });

    it('should show the toggle controls', () => {
      expect(el.querySelector('.toggle-controls')).not.toBeNull();
    });

    it('should hide the configure button', () => {
      expect(el.querySelector('.edit-btn')).toBeNull();
    });

    it('should update on change', () => {
      $scope.subscriptions = [];
      $scope.$digest();

      expect(el.querySelectorAll('.sub-label').length).toBe(0);
    });

    describe('saving', () => {
      beforeEach(() => {
        el.querySelectorAll('multi-toggler a')[2].click();
        el.querySelector('.save-btn').click();
      });

      it('should show the saving banner', () => {
        expect(el.querySelector('.alert-info')).not.toBeNull();
      });

      it('should patch with the right data', () => {
        expect(socketStream).toHaveBeenCalledOnceWith(
          '/api/alert_subscription/',
          {
            method: 'patch',
            json: {
              objects: [
                {
                  user: '/api/user/2',
                  alert_type: '/api/alert_type/26/'
                }
              ],
              deleted_objects: ['/api/alert_subscription/45/']
            }
          },
          true
        );
      });

      it('should hide the saving banner after completion', () => {
        socket$.write(null);

        expect(el.querySelector('.alert-info')).toBeNull();
      });
    });
  });
});
