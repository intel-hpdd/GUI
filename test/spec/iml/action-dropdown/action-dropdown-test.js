import actionDropdownModule
  from '../../../../source/iml/action-dropdown/action-dropdown-module';
import highland from 'highland';

import { mock, resetAll } from '../../../system-mock.js';

describe('action dropdown', () => {
  let $scope,
    ctrl,
    handleAction,
    actionStream,
    getCommandStream,
    openCommandModal,
    commandStream,
    commandModalStream,
    s,
    ActionDropdownCtrl;

  beforeEachAsync(async function() {
    commandStream = highland();
    spyOn(commandStream, 'destroy');
    getCommandStream = jasmine
      .createSpy('getCommandStream')
      .and.returnValue(commandStream);

    const mod = await mock('source/iml/action-dropdown/action-dropdown.js', {
      'source/iml/command/get-command-stream.js': { default: getCommandStream }
    });
    ActionDropdownCtrl = mod.ActionDropdownCtrl;

    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  afterEach(() => {
    resetAll();
    jasmine.clock().uninstall();
  });

  beforeEach(module(actionDropdownModule));

  beforeEach(
    inject(function($rootScope, $controller) {
      $scope = $rootScope.$new();
      actionStream = highland();
      handleAction = jasmine
        .createSpy('handleAction')
        .and.returnValue(actionStream);

      commandModalStream = highland();
      openCommandModal = jasmine.createSpy('openCommandModal').and.returnValue({
        resultStream: commandModalStream
      });

      s = highland();

      ctrl = $controller(
        ActionDropdownCtrl,
        {
          $scope: $scope,
          actionDescriptionCache: {},
          handleAction: handleAction,
          openCommandModal: openCommandModal
        },
        {
          stream: s
        }
      );
    })
  );

  it('should setup the controller', function() {
    const scope = window.extendWithConstructor(ActionDropdownCtrl, {
      actionDescriptionCache: {},
      handleAction: jasmine.any(Function),
      stream: s,
      tooltipPlacement: 'left',
      actionsProperty: 'available_actions',
      receivedData: false
    });

    expect(ctrl).toEqual(scope);
  });

  describe('handleAction', function() {
    beforeEach(function() {
      ctrl.handleAction(
        {
          record: 'record'
        },
        {
          action: 'action'
        }
      );
    });

    it('should call handle action with record and action', function() {
      expect(handleAction).toHaveBeenCalledOnceWith(
        {
          record: 'record'
        },
        {
          action: 'action'
        }
      );
    });

    it('should get a command stream from the command', function() {
      actionStream.write({
        command: 'command'
      });

      expect(getCommandStream).toHaveBeenCalledOnceWith(['command']);
    });

    it('should open the command modal', function() {
      actionStream.write('command');

      expect(openCommandModal).toHaveBeenCalledOnceWith(commandStream);
    });

    it('should destroy the command stream when the modal gets a result', function() {
      actionStream.write('command');
      commandModalStream.write('done');

      jasmine.clock().tick();

      expect(commandStream.destroy).toHaveBeenCalledTimes(1);
    });

    it('should indicate that data has not been received', () => {
      expect(ctrl.receivedData).toBe(false);
    });
  });

  describe('filtering data without actions property', () => {
    beforeEach(() => {
      s.write([
        {
          id: 31,
          resource_uri: '/api/storage_resource/31/'
        }
      ]);
    });

    it('should indicate data has been received', () => {
      expect(ctrl.receivedData).toBe(true);
    });

    it('should filter out the record', () => {
      expect(ctrl.records).toEqual([]);
    });
  });

  describe('passing down data containing the actions property', () => {
    let data;
    beforeEach(() => {
      data = [
        {
          id: 1,
          label: 'corosync2 configuration',
          locks: {
            read: [],
            write: []
          },
          resource_uri: '/api/corosync_configuration/1/',
          available_actions: [
            {
              display_group: 1,
              display_order: 30,
              last: true,
              long_description: 'Unconfiguring Corosync',
              state: 'unconfigured',
              verb: 'Unconfigure Corosync'
            },
            {
              display_group: 3,
              display_order: 100,
              long_description: 'Stop Corosync on this host.',
              state: 'stopped',
              verb: 'Stop Corosync'
            }
          ]
        }
      ];

      s.write(data);
      jasmine.clock().tick();
    });

    it('should indicate data has been received', () => {
      expect(ctrl.receivedData).toBe(true);
    });

    it('should pass the record through', () => {
      expect(ctrl.records).toEqual(data);
    });
  });
});
