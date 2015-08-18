describe('alert status', function () {
  'use strict';

  beforeEach(module('status'));

  var socketStream, stream;

  describe('monitor', function () {
    beforeEach(module(function ($provide) {
      stream = highland();
      spyOn(stream, 'destroy');

      socketStream = jasmine.createSpy('socketStream')
        .andReturn(stream);

      $provide.value('socketStream', socketStream);
    }));

    var alertMonitor;

    beforeEach(inject(function (_alertMonitor_) {
      alertMonitor = _alertMonitor_;
    }));

    it('should request alerts', function () {
      alertMonitor();

      expect(socketStream).toHaveBeenCalledOnceWith('/alert/', {
        jsonMask: 'objects(alert_item,message)',
        qs: {
          limit: 0,
          active: true
        }
      });
    });

    it('should pluck objects', function () {
      var s2 = alertMonitor();

      s2.each(function (x) {
        expect(x).toEqual([{ foo: 'bar' }]);
      });

      stream.write({
        objects: [{ foo: 'bar' }]
      });
    });

    it('should destroy the source', function () {
      var s2 = alertMonitor();

      s2.destroy();

      expect(stream.destroy).toHaveBeenCalledOnce();
    });
  });

  describe('directive', function () {
    var $scope, element, node, getPopover, i, stream, addProperty;

    beforeEach(module('templates', 'ui.bootstrap.tooltip', 'ui.bootstrap.tpls'));

    beforeEach(inject(function ($rootScope, $compile, _addProperty_) {
      addProperty = _addProperty_;

      // Create an instance of the element
      element = '<record-state record-id="recordId" alert-stream="alertStream" display-type="\'medium\'">' +
      '</record-state>';

      stream = highland();

      $scope = $rootScope.$new();

      $scope.alertStream = stream.through(addProperty);

      $scope.recordId = 'host/6';

      node = $compile(element)($scope);

      // Update the html
      $scope.$digest();

      getPopover = function getPopover () {
        return node.find('i ~ .popover');
      };

      i = node.find('i');
    }));

    describe('response contains alerts', function () {
      beforeEach(function () {
        var response = [
          {
            alert_item: 'host/6',
            message: 'response message'
          }
        ];

        stream.write(response);
        $scope.$digest();
      });

      it('should have an alert message if the response contains one.', function () {
        expect($scope.$$childHead.recordState.alerts).toEqual(['response message']);
      });

      it('should have a tool tip message', function () {
        expect($scope.$$childHead.recordState.getTooltipMessage()).toEqual('1 alert message. Click to review details.');
      });

      it('should be in error state', function () {
        expect($scope.$$childHead.recordState.isInErrorState()).toEqual(true);
      });

      it('should show the label', function () {
        expect($scope.$$childHead.recordState.showLabel()).toEqual(true);
      });

      it('should show the label in markup', function () {
        expect(node.find('.state-label').hasClass('ng-hide')).toEqual(false);
      });
    });

    describe('exclamation icon interaction', function () {
      var response;

      beforeEach(function () {
        response = [
          {
            alert_item: 'host/6',
            message: 'response message'
          }
        ];

        stream.write(response);
        $scope.$digest();

        i = node.find('i');
      });

      it('should display the info icon', function () {
        expect(i).toBeShown();
      });

      it('should display the popover after clicking info icon', function () {
        i.trigger('click');

        expect(getPopover()).toBeShown();
      });

      it('should display the tooltip after mousing over the info icon', function () {
        i.trigger('mouseover');

        var tooltip = node.find('.tooltip');
        expect(tooltip).toBeShown();
      });
    });

    describe('message updates', function () {
      var response;
      beforeEach(function () {
        response = [
          {
            alert_item: 'host/6',
            message: 'response message1'
          }
        ];

        stream.write(response);

        // Change the response to have 2 messages now
        response = [
          {
            alert_item: 'host/6',
            message: 'response message1'
          },
          {
            alert_item: 'host/6',
            message: 'response message2'
          }
        ];

        stream.write(response);

        // Now, remove the first message so that only message 2 remains
        response = [
          {
            alert_item: 'host/6',
            message: 'response message2'
          }
        ];

        stream.write(response);
      });

      it('should contain the second message in the alerts array.', function () {
        expect($scope.$$childHead.recordState.alerts).toEqual(['response message2']);
      });

      it('should contain only message1 in the difference array.', function () {
        expect($scope.$$childHead.recordState.messageDifference).toEqual(['response message1']);
      });
    });

    describe('no display type', function () {
      beforeEach(inject(function ($rootScope, $compile) {
        // Create an instance of the element
        element = '<record-state record-id="recordId" alert-stream="alertStream"></record-state>';

        $scope = $rootScope.$new();

        $scope.recordId = 'host/6';

        stream = highland();

        $scope.alertStream = stream.through(addProperty);

        node = $compile(element)($scope);

        // Update the html
        $scope.$digest();

        var response = [
          {
            alert_item: 'host/6',
            message: 'response message'
          }
        ];

        stream.write(response);
        $scope.$digest();
      }));

      it('should not show the label', function () {
        expect($scope.$$childHead.recordState.showLabel()).toEqual(false);
      });

      it('should not show the label in markup', function () {
        expect(node.find('.state-label').hasClass('ng-hide')).toEqual(true);
      });
    });
  });
});
