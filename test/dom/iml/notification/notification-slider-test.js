import highland from 'highland';
import {
  notificationSlider,
  NotificationSliderController
} from '../../../../source/iml/notification/notification-slider.js';
import angular from '../../../angular-mock-setup.js';

describe('The notification slider directive', () => {
  let el, $scope, $timeout, findSlider;

  beforeEach(
    angular.mock.module(($controllerProvider, $compileProvider) => {
      $controllerProvider.register(
        'NotificationSliderController',
        NotificationSliderController
      );
      $compileProvider.directive('notificationSlider', notificationSlider);
    })
  );

  beforeEach(
    angular.mock.inject(($rootScope, $compile, _$timeout_) => {
      const template =
        '<notification-slider stream="stream"></notification-slider>';
      $timeout = _$timeout_;
      $scope = $rootScope.$new();
      $scope.stream = highland();
      $scope.hostId = '1';
      el = $compile(template)($scope)[0];
      findSlider = () => el.querySelector('.notification-slider');
      $scope.$digest();
    })
  );

  beforeEach(() => {
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  describe('a single alert', () => {
    beforeEach(() => {
      $scope.stream.write({ objects: [{ message: 'an alert' }] });
      // Flush 0 because JSDOM sets document to hidden which pushes
      // an untrackable $timeout animate call onto the $timeout queue.
      $timeout.flush(0);
    });

    it('should display', () => {
      expect(findSlider()).toBeShown();
    });

    it('should display a message', () => {
      const text = el
        .querySelector('.notification-message h4')
        .textContent.trim();

      expect(text).toEqual('an alert');
    });

    it('should retract after 5 seconds', () => {
      $timeout.flush(5000);
      expect(findSlider()).toBeNull();
    });

    it('should be closable', () => {
      el.querySelector('.btn-danger').click();
      expect(findSlider()).toBeNull();
    });

    describe('mousing', () => {
      beforeEach(() => {
        const event = new MouseEvent('mouseover', {
          clientX: 50,
          clientY: 50,
          bubbles: true
        });

        findSlider().dispatchEvent(event);
        $timeout.verifyNoPendingTasks();
      });

      it('should stay open while moused over', () => {
        $timeout.flush(5000);

        expect(findSlider()).toBeShown();
        $timeout.verifyNoPendingTasks();
      });

      it('should close when moused out', () => {
        const event = new MouseEvent('mouseout', {
          clientX: 500,
          clientY: 500,
          bubbles: true
        });
        findSlider().dispatchEvent(event);

        $timeout.flush(5000);
        expect(findSlider()).toBeNull();
      });
    });
  });
  describe('multiple alerts', () => {
    beforeEach(() => {
      $scope.stream.write({
        objects: [{ message: 'foo1' }, { message: 'foo2' }]
      });
    });
    it('should display a message', () => {
      const text = el
        .querySelector('.notification-message h4')
        .textContent.trim();
      expect(text).toEqual('2 active alerts');
    });
  });
  describe('writing empty', () => {
    beforeEach(() => {
      $scope.stream.write({ objects: [] });
    });
    it('should not display the slider', () => {
      expect(findSlider()).toBeNull();
    });
  });
});
