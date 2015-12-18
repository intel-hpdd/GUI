describe('Command monitor controller', function () {
  'use strict';

  var $scope, ctrl, getCommandStream, commandStream, commandMonitor, openCommandModal;

  beforeEach(window.module('command'));

  beforeEach(inject(function ($rootScope, $controller, $q) {
    $scope = $rootScope.$new();

    spyOn($scope, '$on').andCallThrough();

    commandStream = highland();
    spyOn(commandStream, 'destroy');
    getCommandStream = jasmine.createSpy('getCommandStream')
      .andReturn(commandStream);

    commandMonitor = highland();
    spyOn(commandMonitor, 'destroy');

    openCommandModal = jasmine.createSpy('openCommandModal')
      .andReturn({
        result: $q.when()
      });

    ctrl = $controller('CommandMonitorCtrl', {
      $scope: $scope,
      commandMonitor: commandMonitor,
      openCommandModal: openCommandModal,
      getCommandStream: getCommandStream
    });
  }));

  describe('destroy', function () {
    it('should listen', function () {
      expect($scope.$on).toHaveBeenCalledOnceWith('$destroy', jasmine.any(Function));
    });

    it('should end the monitor on destroy', function () {
      var handler = $scope.$on.mostRecentCall.args[1];

      handler();

      expect(commandMonitor.destroy).toHaveBeenCalledOnce();
    });
  });

  describe('handling responses', function () {
    var lastObjects;

    beforeEach(function () {
      lastObjects = [{}];

      commandMonitor.write(lastObjects);
    });

    it('should update length', function () {
      expect(ctrl.length).toEqual(1);
    });

    it('should save the last response', function () {
      expect(ctrl.lastObjects).toEqual(lastObjects);
    });

    describe('show pending', function () {
      beforeEach(function () {
        ctrl.showPending();
      });

      it('should open the command modal with the stream', function () {
        expect(openCommandModal).toHaveBeenCalledOnceWith(commandStream);
      });

      it('should call getCommandStream with the last response', function () {
        expect(getCommandStream).toHaveBeenCalledOnceWith(lastObjects);
      });

      it('should end the stream after the modal closes', function () {
        openCommandModal.plan().result.finally(function whenModalClosed () {
          expect(commandStream.destroy).toHaveBeenCalledOnce();
        });

        $scope.$digest();
      });
    });
  });
});

describe('Command monitor', function () {
  'use strict';

  var socketStream, stream;

  beforeEach(window.module('command', function ($provide) {
    stream = highland();
    socketStream = jasmine.createSpy('requestSocket').andReturn(stream);
    $provide.value('socketStream', socketStream);
  }));

  var commandMonitor;

  beforeEach(inject(function (_commandMonitor_) {
    commandMonitor = _commandMonitor_;
  }));

  it('should request data', function () {
    expect(socketStream).toHaveBeenCalledOnceWith('/command', {
      qs: {
        limit: 0,
        errored: false,
        complete: false
      }
    });
  });

  it('should return a stream', function () {
    var proto = Object.getPrototypeOf(highland());

    expect(Object.getPrototypeOf(commandMonitor)).toBe(proto);
  });

  it('should filter cancelled commands', function () {
    stream.write({
      objects: [
        { cancelled: true },
        { cancelled: false }
      ]
    });

    commandMonitor.each(function (x) {
      expect(x).toEqual([
        { cancelled: false }
      ]);
    });
  });
});
