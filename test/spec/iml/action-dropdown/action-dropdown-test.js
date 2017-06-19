import highland from 'highland';
import angular from '../../../angular-mock-setup.js';

describe('action dropdown', () => {
  let $scope,
    ctrl,
    handleAction,
    actionStream,
    mockGetCommandStream,
    openCommandModal,
    commandStream,
    commandModalStream,
    s,
    ActionDropdownCtrl;

  beforeEach(() => {

    commandStream = highland();
    jest.spyOn(commandStream, 'destroy');
    mockGetCommandStream = jest.fn(() => commandStream);

    jest.mock(
      '../../../../source/iml/command/get-command-stream.js',
      () => mockGetCommandStream
    );

    const mod = require('../../../../source/iml/action-dropdown/action-dropdown.js');

    ActionDropdownCtrl = mod.ActionDropdownCtrl;

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  beforeEach(
    angular.mock.inject(
      ($rootScope, $exceptionHandler, localApply, propagateChange) => {
        $scope = $rootScope.$new();
        actionStream = highland();
        handleAction = jest.fn(() => actionStream);

        commandModalStream = highland();
        openCommandModal = jest.fn(() => ({
          resultStream: commandModalStream
        }));

        s = highland();

        ctrl = {
          stream: s
        };

        ActionDropdownCtrl.bind(ctrl)(
          $scope,
          $exceptionHandler,
          handleAction,
          {},
          openCommandModal,
          localApply,
          propagateChange
        );
      }
    )
  );

  it('should setup the controller', () => {
    const scope = {
      ...ctrl,
      ...{
        actionDescriptionCache: {},
        handleAction: expect.any(Function),
        stream: s,
        tooltipPlacement: 'left',
        actionsProperty: 'available_actions',
        receivedData: false
      }
    };

    expect(ctrl).toEqual(scope);
  });

  describe('handleAction', () => {
    beforeEach(() => {
      ctrl.handleAction(
        {
          record: 'record'
        },
        {
          action: 'action'
        }
      );
    });

    it('should call handle action with record and action', () => {
      expect(handleAction).toHaveBeenCalledOnceWith(
        {
          record: 'record'
        },
        {
          action: 'action'
        }
      );
    });

    it('should get a command stream from the command', () => {
      actionStream.write({
        command: 'command'
      });

      expect(mockGetCommandStream).toHaveBeenCalledTimes(1);
      expect(mockGetCommandStream).toHaveBeenCalledWith(['command']);
    });

    it('should open the command modal', () => {
      actionStream.write('command');

      expect(openCommandModal).toHaveBeenCalledOnceWith(commandStream);
    });

    it('should destroy the command stream when the modal gets a result', () => {
      actionStream.write('command');
      commandModalStream.write('done');

      jest.runAllTimers();

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
      jest.runAllTimers();
    });

    it('should indicate data has been received', () => {
      expect(ctrl.receivedData).toBe(true);
    });

    it('should pass the record through', () => {
      expect(ctrl.records).toEqual(data);
    });
  });
});
