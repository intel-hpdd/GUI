import highland from 'highland';
import angular from '../../../angular-mock-setup.js';

describe('Command monitor controller', () => {
  let $scope,
    ctrl,
    mockGetCommandStream,
    commandStream,
    openCommandModal,
    openCommandModalPromise,
    mod,
    mockSocketStream,
    stream;

  beforeEach(() => {
    stream = highland();
    mockSocketStream = jest.fn(() => stream);
    jest.spyOn(stream, 'destroy');

    commandStream = highland();
    jest.spyOn(commandStream, 'destroy');
    mockGetCommandStream = jest.fn(() => commandStream);

    jest.mock('../../../../source/iml/socket/socket-stream', () => mockSocketStream);
    jest.mock('../../../../source/iml/command/get-command-stream', () => mockGetCommandStream);
    mod = require('../../../../source/iml/command/command-monitor-directive.js');
  });

  beforeEach(
    angular.mock.inject(($rootScope, $controller, $q) => {
      $scope = $rootScope.$new();
      jest.spyOn($scope, '$on');

      openCommandModalPromise = $q.when();
      openCommandModal = jest.fn(() => ({
        result: openCommandModalPromise
      }));

      ctrl = $controller(mod.CommandMonitorCtrl, {
        $scope,
        openCommandModal
      });
    })
  );

  it('should request data', () => {
    expect(mockSocketStream).toHaveBeenCalledOnceWith('/command', {
      qs: {
        limit: 0,
        errored: false,
        complete: false
      }
    });
  });

  describe('destroy', () => {
    it('should listen', () => {
      expect($scope.$on).toHaveBeenCalledOnceWith('$destroy', expect.any(Function));
    });

    it('should end the monitor on destroy', () => {
      const handler = $scope.$on.mock.calls[0][1];

      handler();

      expect(stream.destroy).toHaveBeenCalledTimes(1);
    });
  });

  describe('handling responses', () => {
    let lastObjects;

    beforeEach(() => {
      lastObjects = {
        objects: [{ cancelled: true }, { cancelled: false }]
      };

      stream.write(lastObjects);
    });

    it('should update length', () => {
      expect(ctrl.length).toEqual(1);
    });

    it('should save the last response', () => {
      expect(ctrl.lastObjects).toEqual([{ cancelled: false }]);
    });

    describe('show pending', () => {
      beforeEach(() => {
        ctrl.showPending();
      });

      it('should open the command modal with the stream', () => {
        expect(openCommandModal).toHaveBeenCalledOnceWith(commandStream);
      });

      it('should call getCommandStream with the last response', () => {
        expect(mockGetCommandStream).toHaveBeenCalledOnceWith([{ cancelled: false }]);
      });

      it('should end the stream after the modal closes', () => {
        openCommandModalPromise.finally(() => {
          expect(commandStream.destroy).toHaveBeenCalledTimes(1);
        });

        $scope.$digest();
      });
    });
  });
});
