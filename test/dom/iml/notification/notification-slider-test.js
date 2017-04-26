import highland from 'highland';

import notificationModule
  from '../../../../source/iml/notification/notification-module';

describe('The notification slider directive', function() {
  beforeEach(module(notificationModule));

  let el, $scope, $timeout, findSlider;

  beforeEach(
    inject(function($rootScope, $compile, _$timeout_) {
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

  describe('a single alert', function() {
    beforeEach(function() {
      $scope.stream.write({
        objects: [
          {
            message: 'an alert'
          }
        ]
      });
    });

    it('should display', function() {
      expect(findSlider()).toBeShown();
    });

    it('should display a message', function() {
      const text = el
        .querySelector('.notification-message h4')
        .textContent.trim();

      expect(text).toEqual('an alert');
    });

    it('should retract after 5 seconds', function() {
      $timeout.flush(5000);
      expect(findSlider()).toBeNull();
    });

    it('should be closable', function() {
      el.querySelector('.btn-danger').click();

      expect(findSlider()).toBeNull();
    });

    describe('mousing', function() {
      beforeEach(function() {
        document.body.appendChild(el);
      });

      afterEach(function() {
        document.body.removeChild(el);
      });

      it('should stay open while moused over', function() {
        const event = new MouseEvent('mouseover', {
          clientX: 50,
          clientY: 50,
          bubbles: true
        });
        findSlider().dispatchEvent(event);

        $timeout.verifyNoPendingTasks();

        $timeout.flush(5000);

        expect(findSlider()).toBeShown();
        $timeout.verifyNoPendingTasks();
      });

      it('should close when moused out', function() {
        let event = new MouseEvent('mouseover', {
          clientX: 50,
          clientY: 50,
          bubbles: true
        });
        findSlider().dispatchEvent(event);

        $timeout.verifyNoPendingTasks();

        event = new MouseEvent('mouseout', {
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

  describe('multiple alerts', function() {
    beforeEach(function() {
      $scope.stream.write({
        objects: [{ message: 'foo1' }, { message: 'foo2' }]
      });
    });

    it('should display a message', function() {
      const text = el
        .querySelector('.notification-message h4')
        .textContent.trim();

      expect(text).toEqual('2 active alerts');
    });
  });

  describe('writing empty', function() {
    beforeEach(function() {
      $scope.stream.write({
        objects: []
      });
    });

    it('should not display the slider', function() {
      expect(findSlider()).toBeNull();
    });
  });
});
