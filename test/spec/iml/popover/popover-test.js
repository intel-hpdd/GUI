import positionModule from '../../../../source/iml/position/position-module.js';
import popoverModule from '../../../../source/iml/popover/popover-module.js';
import angular from '../../../angular-mock-setup.js';

describe('popover', () => {
  let $timeout, $scope, el, popover, button;

  beforeEach(angular.mock.module(positionModule));
  beforeEach(angular.mock.module(popoverModule));

  beforeEach(
    inject(($rootScope, $compile, _$timeout_) => {
      $timeout = _$timeout_;

      const template = `
      <div>
        <a class="activate-popover">Click ME!</a>
        <iml-popover placement="right" work="workFn(actions)" title="Testing" on-toggle="onToggle(state)">
          <button>Test click</button>
        </iml-popover>
      </div>`;

      $scope = $rootScope.$new();

      $scope.workFn = jest.fn();
      $scope.onToggle = jest.fn();

      el = $compile(template)($scope)[0];

      $scope.$digest();

      button = el.querySelector('a');
    })
  );

  it('should be not render before opening', () => {
    expect(el.querySelector('.popover')).toBeNull();
  });

  describe('open', () => {
    beforeEach(() => {
      button.click();
      $timeout.flush();

      popover = el.querySelector('.popover');
    });

    beforeEach(() => {
      document.body.appendChild(popover);
    });

    afterEach(() => {
      if (popover.parentElement) document.body.removeChild(popover);
    });

    it('should display when the button is clicked', () => {
      expect(popover).toHaveClass('in');
    });

    it('should call scope.onToggle and set state to open', () => {
      expect($scope.onToggle).toHaveBeenCalledOnceWith('opened');
    });

    it('should hide when button is clicked twice', () => {
      button.click();
      $timeout.flush();

      expect(popover).not.toHaveClass('in');
    });

    it('should call scope.onToggle and set the state to closed', () => {
      button.click();
      $timeout.flush();

      expect($scope.onToggle).toHaveBeenCalledOnceWith('closed');
    });

    it('should hide when body is clicked', () => {
      document.body.click();
      $timeout.flush();

      expect(popover).not.toHaveClass('in');
    });

    it('should not hide when the popover is clicked', () => {
      popover.click();

      expect(popover).toHaveClass('in');
    });

    it('should not hide when a child of the popover is clicked', () => {
      popover.querySelector('button').click();

      expect(popover).toHaveClass('in');
    });

    it('should provide a work function', () => {
      expect($scope.workFn).toHaveBeenCalledWith(jasmine.any(Object));
    });
  });
});
