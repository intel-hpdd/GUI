import highland from 'highland';

import statusModule from  '../../../../source/iml/status/status-module.js';

import {
  flow,
  lensProp,
  view,
  invokeMethod
} from 'intel-fp';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('deferred action dropdown', () => {
  var socketStream, s, mod;

  beforeEachAsync(async function () {
    s = highland();
    socketStream = jasmine.createSpy('socketStream')
      .and.returnValue(s);

    mod = await mock('source/iml/status/deferred-action-dropdown.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });
  });

  beforeEach(module(statusModule, ($controllerProvider) => {
    $controllerProvider.register('DeferredActionDropdownCtrl', mod.DeferredActionDropdownCtrl);
  }));

  afterEach(resetAll);

  var el, $scope, qs, actionDropdown,
    dropdownButton, loadingButton,
    cleanText;

  beforeEach(inject(($rootScope, $compile) => {
    const template = '<deferred-action-dropdown row="::row"></deferred-action-dropdown>';

    $scope = $rootScope.$new();
    $scope.row = {
      affected: [
        'thing1'
      ]
    };

    cleanText = flow(
      view(lensProp('textContent')),
      invokeMethod('trim', [])
    );

    el = $compile(template)($scope)[0];
    qs = el.querySelector.bind(el);
    actionDropdown = qs.bind(el, 'action-dropdown');
    dropdownButton = qs.bind(el, '.dropdown-toggle');
    loadingButton = qs.bind(el, '.loading-btn');
    $scope.$digest();
  }));

  it('should show the action dropdown', () => {
    expect(dropdownButton()).toBeShown();
  });

  describe('when moused over', () => {
    beforeEach(() => {
      document.body
        .appendChild(el);

      const event = new MouseEvent('mouseover', {
        clientX: 50,
        clientY: 50,
        bubbles: true
      });
      dropdownButton().dispatchEvent(event);
      $scope.$apply();
    });

    afterEach(() => {
      document.body
        .removeChild(el);
    });

    it('should show loading', () => {
      expect(loadingButton()).toBeShown();
    });

    it('should have waiting text', () => {
      expect(cleanText(loadingButton())).toBe('Waiting');
    });

    describe('and loaded', () => {
      beforeEach(() => {
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
              long_description: 'Initiate an orderly shutdown on the host. Any HA-capable targets running on \
  the host will \
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

      it('should hide the loading button', () => {
        expect(loadingButton()).not.toBeShown();
      });

      it('should show the action dropdown', () => {
        expect(actionDropdown()).toBeShown();
      });

      it('should show the dropdown on click', () => {
        dropdownButton().click();
        expect(qs('.btn-group').classList.contains('open')).toBe(true);
      });
    });
  });
});
