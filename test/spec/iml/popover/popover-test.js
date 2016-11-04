import angular from 'angular';
import popoverModule from '../../../../source/iml/popover/popover-module';


describe('popover', () => {
  let $window, $timeout, $scope, el, popover, button;

  beforeEach(module(popoverModule));

  beforeEach(inject(($rootScope, $compile, _$window_, _$timeout_) => {
    $timeout = _$timeout_;

    const template = `
      <div>
        <a class="activate-popover">Click ME!</a>
        <iml-popover placement="right" work="workFn(actions)" title="Testing" on-toggle="onToggle(state)">
          <button>Test click</button>
        </iml-popover>
      </div>`;


    $scope = $rootScope.$new();

    $scope.workFn = jasmine.createSpy('workFn');
    $scope.onToggle = jasmine.createSpy('onToggle');

    el = $compile(template)($scope);

    $scope.$digest();

    $window = _$window_;

    button = el.find('a');
  }));

  it('should be not render before opening', function () {
    expect(el.find('.popover').length).toBe(0);
  });

  describe('open', function () {
    beforeEach(function () {
      button.click();
      $timeout.flush();

      popover = el.find('.popover');
    });

    afterEach(function () {
      popover.remove();
    });

    it('should display when the button is clicked', function () {
      expect(popover).toHaveClass('in');
    });

    it('should call scope.onToggle and set state to open', function () {
      expect($scope.onToggle).toHaveBeenCalledOnceWith('opened');
    });

    it('should hide when button is clicked twice', function () {
      button.click();
      $timeout.flush();

      expect(popover).not.toHaveClass('in');
    });

    it('should call scope.onToggle and set the state to closed', function () {
      button.click();
      $timeout.flush();

      expect($scope.onToggle).toHaveBeenCalledOnceWith('closed');
    });

    it('should hide when window is clicked', function () {
      angular.element($window).click();
      $timeout.flush();

      expect(popover).not.toHaveClass('in');
    });

    it('should not hide when the popover is clicked', function () {
      popover.appendTo(document.body);

      popover.click();

      expect(popover).toHaveClass('in');
    });

    it('should not hide when a child of the popover is clicked', function () {
      popover.appendTo(document.body);

      popover.find('button').click();

      expect(popover).toHaveClass('in');
    });

    it('should provide a work function', function () {
      expect($scope.workFn).toHaveBeenCalledWith(jasmine.any(Object));
    });
  });
});
