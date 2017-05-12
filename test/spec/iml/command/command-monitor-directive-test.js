import highland from 'highland';

import { mock, resetAll } from '../../../system-mock.js';

describe('Command monitor controller', () => {
  let $scope,
    ctrl,
    getCommandStream,
    commandStream,
    openCommandModal,
    openCommandModalPromise,
    mod,
    socketStream,
    stream;

  beforeEachAsync(async function() {
    stream = highland();
    socketStream = jasmine.createSpy('socketStream').and.returnValue(stream);
    spyOn(stream, 'destroy');

    commandStream = highland();
    spyOn(commandStream, 'destroy');
    getCommandStream = jasmine
      .createSpy('getCommandStream')
      .and.returnValue(commandStream);

    mod = await mock('source/iml/command/command-monitor-directive.js', {
      'source/iml/socket/socket-stream': {
        default: socketStream
      },
      'source/iml/command/get-command-stream': {
        default: getCommandStream
      }
    });
  });

  afterEach(resetAll);

  beforeEach(module('extendScope'));

  beforeEach(
    inject(($rootScope, $controller, $q) => {
      $scope = $rootScope.$new();
      spyOn($scope, '$on').and.callThrough();

      openCommandModalPromise = $q.when();
      openCommandModal = jasmine.createSpy('openCommandModal').and.returnValue({
        result: openCommandModalPromise
      });

      ctrl = $controller(mod.CommandMonitorCtrl, {
        $scope,
        openCommandModal
      });
    })
  );

  it('should request data', () => {
    expect(socketStream).toHaveBeenCalledOnceWith('/command', {
      qs: {
        limit: 0,
        errored: false,
        complete: false
      }
    });
  });

  describe('destroy', () => {
    it('should listen', () => {
      expect($scope.$on).toHaveBeenCalledOnceWith(
        '$destroy',
        jasmine.any(Function)
      );
    });

    it('should end the monitor on destroy', () => {
      const handler = $scope.$on.calls.mostRecent().args[1];

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
        expect(getCommandStream).toHaveBeenCalledOnceWith([
          { cancelled: false }
        ]);
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
