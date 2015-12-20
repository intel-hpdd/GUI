import angular from 'angular';
const {module, inject} = angular.mock;

describe('deferred action dropdown', function () {
  var socketStream, s;

  beforeEach(module('status', 'templates', function ($provide) {
    s = highland();

    socketStream = jasmine.createSpy('socketStream')
      .andReturn(s);
    $provide.value('socketStream', socketStream);
  }));

  var el, $scope, qs, actionDropdown,
    dropdownButton, loadingButton,
    cleanText;

  beforeEach(inject(function ($rootScope, $compile) {
    var template = '<deferred-action-dropdown row="::row"></deferred-action-dropdown>';

    $scope = $rootScope.$new();
    $scope.row = {
      affected: [
        'thing1'
      ]
    };

    cleanText = fp.flow(
      fp.lensProp('textContent'),
      fp.invokeMethod('trim', [])
    );

    el = $compile(template)($scope)[0];
    qs = el.querySelector.bind(el);
    actionDropdown = qs.bind(el, 'action-dropdown');
    dropdownButton = qs.bind(el, '.dropdown-toggle');
    loadingButton = qs.bind(el, '.loading-btn');
    $scope.$digest();
  }));

  it('should show the action dropdown', function () {
    expect(dropdownButton()).toBeShown();
  });

  describe('when moused over', function () {
    beforeEach(function () {
      document.body
        .appendChild(el);

      var event = new MouseEvent('mouseover', {
        clientX: 50,
        clientY: 50,
        bubbles: true
      });
      dropdownButton().dispatchEvent(event);
      $scope.$apply();
    });

    afterEach(function () {
      document.body
        .removeChild(el);
    });

    it('should show loading', function () {
      expect(loadingButton()).toBeShown();
    });

    it('should have loading text', function () {
      expect(cleanText(loadingButton())).toBe('Loading');
    });

    describe('and loaded', function () {
      beforeEach(function () {
        s.write({
          label: 'server001',
          available_actions: [
            {
              args: {
                host_id: 2
              },
              class_name: 'ShutdownHostJob',
              confirmation: 'Initiate an orderly shutdown on the host. Any HA-capable targets running on the host will \
  be failed over to a peer. Non-HA-capable targets will be unavailable until the host has been restarted.',
              display_group: 2,
              display_order: 60,
              long_description: 'Initiate an orderly shutdown on the host. Any HA-capable targets running on the host will \
  be failed over to a peer. Non-HA-capable targets will be unavailable until the host has been restarted.',
              verb: 'Shutdown'
            },
            {
              args: {
                host_id: 2
              },
              class_name: 'RebootHostJob',
              confirmation: null,
              display_group: 2,
              display_order: 50,
              long_description: 'Initiate a reboot on the host. Any HA-capable targets running on the host will be \
  failed over to a peer. Non-HA-capable targets will be unavailable until the host has finished rebooting.',
              verb: 'Reboot'
            }
          ],
          locks: {
            write: []
          }
        });
      });

      it('should hide the loading button', function () {
        expect(loadingButton()).not.toBeShown();
      });

      it('should show the action dropdown', function () {
        expect(actionDropdown()).toBeShown();
      });

      it('should show the dropdown on click', function () {
        dropdownButton().click();
        expect(qs('.btn-group').classList.contains('open')).toBe(true);
      });
    });
  });
});
