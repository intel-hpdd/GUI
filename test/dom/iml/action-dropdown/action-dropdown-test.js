import highland from 'highland';
import * as fp from 'intel-fp';
import {
  imlTooltip
} from '../../../../source/iml/tooltip/tooltip.js';
import actionDropdownModule from '../../../../source/iml/action-dropdown/action-dropdown-module.js';


describe('action dropdown directive', function () {
  let handleAction, openCommandModal, getCommandStream, cleanText;

  beforeEach(module(actionDropdownModule, function ($compileProvider, $provide) {
    handleAction = jasmine.createSpy('handleAction')
      .and.returnValue(highland());
    $provide.value('handleAction', handleAction);

    getCommandStream = jasmine.createSpy('getCommandStream')
      .and.returnValue(highland());
    $provide.value('getCommandStream', getCommandStream);

    openCommandModal = jasmine.createSpy('openCommandModal');
    $provide.value('openCommandModal', openCommandModal);

    $compileProvider.directive('imlTooltip', imlTooltip);

    cleanText = fp.flow(
      fp.view(fp.lensProp('textContent')),
      fp.invokeMethod('trim', [])
    );

    jasmine.clock().install();
  }));

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  let $scope, $timeout, el, button, records, groupHeaders,
    buttonGroup, verbs, tooltip, tooltipText;

  describe('before records are sent', () => {
    beforeEach(inject(function ($compile, $rootScope) {
      $scope = $rootScope.$new();

      $scope.stream = highland();

      const template = '<action-dropdown stream="stream"></action-dropdown>';
      el = $compile(template)($scope)[0];
      document.body.appendChild(el);
      $scope.$digest();

      button = el.querySelector.bind(el, 'button');
    }));

    afterEach(function () {
      document.body.removeChild(el);
    });

    it('should have the standard actions button', () => {
      expect(cleanText(button()))
        .toEqual('Actions');
    });
  });

  describe('without records', () => {
    beforeEach(inject(function ($compile, $rootScope) {
      $scope = $rootScope.$new();

      $scope.stream = highland();
      $scope.stream.write([]);

      const template = '<action-dropdown stream="stream"></action-dropdown>';
      el = $compile(template)($scope)[0];
      document.body.appendChild(el);
      $scope.$digest();

      button = el.querySelector.bind(el, 'button');
    }));

    afterEach(function () {
      document.body.removeChild(el);
    });

    it('should have a no actions button', function () {
      expect(cleanText(button()))
        .toEqual('No Actions');
    });
  });

  describe('with records', () => {
    beforeEach(inject(function ($compile, $rootScope, _$timeout_) {
      $scope = $rootScope.$new();
      $timeout = _$timeout_;

      $scope.stream = highland();

      records = [
        {
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
              long_description: 'Initiate an orderly shutdown on the host. \
    Any HA-capable targets running on the host will \
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
        },
        {
          available_actions: [
            {
              display_group: 3,
              display_order: 100,
              long_description: 'Shut down the LNet networking layer and stop any targets running on this server.',
              state: 'lnet_down',
              verb: 'Stop LNet'
            },
            {
              display_group: 3,
              display_order: 110,
              long_description: 'If LNet is running, stop LNET and unload the LNet kernel module to ensure that \
  it will be reloaded before any targets are started again.',
              state: 'lnet_unloaded',
              verb: 'Unload LNet'
            }
          ],
          content_type_id: 163,
          host: '/api/host/1/',
          id: '1',
          immutable_state: false,
          label: 'lnet configuration',
          locks: {
            read: [],
            write: []
          },
          nids: [
            '/api/nid/4/'
          ],
          not_deleted: true,
          resource_uri: '/api/lnet_configuration/1/',
          state: 'lnet_up',
          state_modified_at: '2015-09-08T23:48:57.747771+00:00'
        }
      ];

      $scope.stream.write(records);

      const template = '<action-dropdown stream="stream"></action-dropdown>';
      el = $compile(template)($scope)[0];
      document.body.appendChild(el);
      $scope.$digest();

      button = el.querySelector.bind(el, 'button');
      buttonGroup = el.querySelector.bind(el, '.btn-group');
      verbs = el.querySelectorAll.bind(el, 'li a');
      groupHeaders = el.querySelectorAll.bind(el, 'li.dropdown-header');
      tooltip = document.body.querySelector.bind(document.body, '.tooltip');
      tooltipText = document.body.querySelector.bind(document.body, '.tooltip .tooltip-inner');
    }));

    afterEach(function () {
      document.body.removeChild(el);
    });

    it('should display the first header', function () {
      expect(cleanText(fp.head(groupHeaders()))).toEqual('server001');
    });

    it('should display the second header', function () {
      expect(cleanText(groupHeaders()[1])).toEqual('lnet configuration');
    });

    it('should display a divider between groups', function () {
      expect(el.querySelector('.divider')).not.toBeNull();
    });

    it('should have an actions dropdown button', function () {
      expect(cleanText(button()))
        .toEqual('Actions');
    });

    it('should put the highest order host action last', function () {
      expect(cleanText(verbs()[1])).toEqual('Shutdown');
    });

    it('should put the lowest order host action first', function () {
      expect(cleanText(fp.head(verbs()))).toEqual('Reboot');
    });

    it('should put the highest order LNet action last', function () {
      expect(cleanText(verbs()[2])).toEqual('Stop LNet');
    });

    it('should put the lowest order LNet action first', function () {
      expect(cleanText(verbs()[3])).toEqual('Unload LNet');
    });

    it('should show the dropdown on click', function () {
      button().click();
      expect(buttonGroup().classList.contains('open')).toBe(true);
    });

    describe('mouseover a verb', function () {
      beforeEach(function () {
        button().click();
        const mouseOver = new MouseEvent('mouseenter');
        fp.head(verbs()).dispatchEvent(mouseOver);
        $timeout.flush();
        $timeout.verifyNoPendingTasks();
      });

      afterEach(function () {
        const tt = tooltip();
        tt.parentNode.removeChild(tt);
      });

      it('should append the tooltip', function () {
        expect(tooltip()).not.toBeNull();
      });

      it('should should show the long description', function () {
        expect(cleanText(tooltipText()))
          .toEqual(records[0].available_actions[0].long_description);
      });

      it('should update the long_description if it changes', function () {
        records[0].available_actions[0].long_description = 'Description of action word';
        $scope.stream.write(records);
        jasmine.clock().tick();

        expect(cleanText(tooltipText()))
          .toEqual('Description of action word');
      });
    });

    describe('clicking a verb', function () {
      beforeEach(function () {
        button().click();
        fp.head(verbs()).click();
      });

      it('should cause the action to be handled', function () {
        expect(handleAction)
          .toHaveBeenCalledOnceWith(records[0], records[0].available_actions[0]);
      });

      it('should disable the button', function () {
        expect(button().disabled).toBe(true);
      });

      it('should remove the dropdown', function () {
        expect(el.querySelector('ul')).toBeNull();
      });
    });

    it('should disable the button if there are write locks', function () {
      records[0].locks.write.push('locked ya!');
      $scope.stream.write(records);
      jasmine.clock().tick();

      expect(button().disabled).toBe(true);
    });

    it('should update the verb if it changes', function () {
      records = JSON.parse(JSON.stringify(records));
      records[0].available_actions[0].verb = 'Action Word';
      $scope.stream.write(records);
      jasmine.clock().tick();

      expect(cleanText(fp.head(verbs()))).toEqual('Action Word');
    });
  });
});
