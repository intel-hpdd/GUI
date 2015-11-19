describe('alert indicator', () => {
  beforeEach(module('alertIndicator'));

  var socketStream, stream;

  describe('monitor', () => {
    beforeEach(module(($provide) => {
      stream = highland();
      spyOn(stream, 'destroy');

      socketStream = jasmine.createSpy('socketStream')
        .andReturn(stream);

      $provide.value('socketStream', socketStream);
    }));

    var alertMonitor;

    beforeEach(inject((_alertMonitor_) => {
      alertMonitor = _alertMonitor_;
    }));

    it('should request alerts', () => {
      alertMonitor();

      expect(socketStream).toHaveBeenCalledOnceWith('/alert/', {
        jsonMask: 'objects(affected,message)',
        qs: {
          limit: 0,
          active: true
        }
      });
    });

    it('should pluck objects', () => {
      var s2 = alertMonitor();

      s2.each((x) => {
        expect(x).toEqual([{ foo: 'bar' }]);
      });

      stream.write({
        objects: [{ foo: 'bar' }]
      });
    });

    it('should destroy the source', () => {
      var s2 = alertMonitor();

      s2.destroy();

      expect(stream.destroy).toHaveBeenCalledOnce();
    });
  });

  describe('directive', () => {
    var $scope, element, node, popover, i,
      stream, addProperty, stateLabel, alerts,
      tooltip;

    beforeEach(module('templates', 'ui.bootstrap.tooltip', 'ui.bootstrap.tpls'));

    beforeEach(inject(($rootScope, $compile, _addProperty_) => {
      addProperty = _addProperty_;

      element = '<record-state record-id="recordId" alert-stream="alertStream" display-type="displayType">' +
      '</record-state>';

      stream = highland();

      $scope = $rootScope.$new();

      $scope.alertStream = stream.through(addProperty);

      $scope.recordId = 'host/6';

      $scope.displayType = 'medium';

      node = $compile(element)($scope)[0];

      $scope.$digest();

      popover = node.querySelector.bind(node, 'i ~ .popover');
      i = node.querySelector.bind(node, 'i');
      alerts = node.querySelectorAll.bind(node, 'li');

      stateLabel = node.querySelector.bind(node, '.state-label');

      tooltip = node.querySelector.bind(node, '.tooltip');
    }));

    describe('response contains alerts', () => {
      var response;

      beforeEach(() => {
        response = [
          {
            affected: ['host/6'],
            message: 'response message'
          },
          {
            affected: ['host/6'],
            message: 'response message 2'
          }
        ];

        stream.write(response);
        i().click();
        $scope.$digest();
      });

      it('should have an alert message if the response contains one.', () => {
        expect(alerts()[0].textContent).toEqual('response message');
      });

      it('should add more alerts when added', function () {
        response.push({
          affected: ['host/6'],
          message: 'response message 3'
        });
        stream.write(response);

        expect(alerts()[2].textContent)
          .toEqual('response message 3');
      });

      it('should remove old alerts', function () {
        response.pop();
        stream.write(response);

        expect(alerts().length)
          .toBe(1);
      });

      it('should hide the popover if there are no alerts', function () {
        stream.write([]);

        expect(popover())
          .toBeNull();
      });

      it('should show the label', () => {
        expect(stateLabel().textContent)
          .toEqual('2 Issues');
      });
    });

    describe('exclamation icon interaction', () => {
      beforeEach(() => {
        const response = [
          {
            affected: ['host/6'],
            message: 'response message'
          }
        ];

        stream.write(response);
      });

      it('should display the info icon', () => {
        expect(i()).toBeShown();
      });

      it('should display the popover after clicking info icon', () => {
        i().click();
        expect(popover()).toBeShown();
      });

      it('should display the tooltip after mousing over the info icon', () => {
        i().dispatchEvent(new MouseEvent('mouseenter'));

        expect(tooltip()).toBeShown();
      });
    });

    describe('no display type', () => {
      beforeEach(() => {
        $scope.displayType = 'small';
        $scope.$digest();
      });

      it('should not show the label', () => {
        expect(stateLabel())
          .toBeNull();
      });
    });
  });
});
