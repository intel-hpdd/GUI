import highland from 'highland';
import broadcast from '../../../../source/iml/broadcaster.js';
import { imlTooltip } from '../../../../source/iml/tooltip/tooltip.js';
import imlPopover from '../../../../source/iml/iml-popover.js';
import Position from '../../../../source/iml/position.js';
import {
  recordStateDirective
} from '../../../../source/iml/alert-indicator/alert-indicator.js';
import angular from '../../../angular-mock-setup.js';

describe('alert indicator', () => {
  beforeEach(
    angular.mock.module(($provide, $compileProvider) => {
      $provide.service('position', Position);
      $compileProvider.directive('imlTooltip', imlTooltip);
      $provide.constant('STATE_SIZE', {
        SMALL: 'small',
        MEDIUM: 'medium',
        LARGE: 'large'
      });
      $compileProvider.directive('imlPopover', imlPopover);
      $compileProvider.directive('recordState', recordStateDirective);
    })
  );

  describe('directive', () => {
    let $scope, element, node, popover, i, stream, stateLabel, alerts, tooltip;

    beforeEach(
      angular.mock.inject(($rootScope, $compile) => {
        element =
          '<record-state record-id="recordId" alert-stream="alertStream" display-type="displayType">' +
          '</record-state>';

        stream = highland();

        $scope = $rootScope.$new();

        $scope.alertStream = broadcast(stream);

        $scope.recordId = 'host/6';

        $scope.displayType = 'medium';

        node = $compile(element)($scope)[0];

        $scope.$digest();

        popover = node.querySelector.bind(node, 'i ~ .popover');
        i = node.querySelector.bind(node, 'i');
        alerts = node.querySelectorAll.bind(node, 'li');

        stateLabel = node.querySelector.bind(node, '.state-label');

        tooltip = node.querySelector.bind(node, '.tooltip');

        document.body.appendChild(node);
      })
    );

    afterEach(() => {
      document.body.removeChild(node);
    });

    describe('response contains alerts', () => {
      let response;

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

      it('should add more alerts when added', () => {
        response.push({
          affected: ['host/6'],
          message: 'response message 3'
        });
        stream.write(response);

        expect(alerts()[2].textContent).toEqual('response message 3');
      });

      it('should remove old alerts', () => {
        response.pop();
        stream.write(response);

        expect(alerts().length).toBe(1);
      });

      it('should hide the popover if there are no alerts', () => {
        stream.write([]);

        expect(popover()).toBeNull();
      });

      it('should show the label', () => {
        expect(stateLabel().textContent).toEqual('2 Issues');
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
        i().dispatchEvent(new MouseEvent('mouseover'));
        expect(tooltip()).toBeShown();
      });
    });

    describe('no display type', () => {
      beforeEach(() => {
        $scope.displayType = 'small';
        $scope.$digest();
      });

      it('should not show the label', () => {
        expect(stateLabel()).toBeNull();
      });
    });
  });
});
