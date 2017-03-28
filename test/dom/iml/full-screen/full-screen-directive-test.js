describe('Full Screen Module', () => {
  let $scope,
    $fullScreenController,
    fullScreenContainer,
    button,
    icon,
    body,
    spy;

  beforeEach(module('fullScreen'));

  beforeEach(
    inject(($rootScope, $compile) => {
      $scope = $rootScope.$new();

      const template = `
    <div class="full-screen">
      <button type="button" full-screen-btn></button>
      <p>This will go fullscreen</p>
    </div>`;

      fullScreenContainer = $compile(template)($scope);
      $scope.$digest();

      $fullScreenController = fullScreenContainer.inheritedData(
        '$fullScreenController'
      );

      spy = jasmine.createSpy('listener');

      button = fullScreenContainer[0].querySelector('button');
      icon = button.querySelector.bind(button, 'i');
      body = document.body;

      $fullScreenController.addListener(spy);
    })
  );

  it('should show the open icon', () => {
    expect(icon()).toHaveClass('fa-expand');
  });

  it('should show the open text', () => {
    expect(button.textContent.trim()).toEqual('Full Screen');
  });

  it('should expose a controller method to remove the listener', () => {
    $fullScreenController.removeListener(spy);

    button.click();
    $scope.$digest();

    expect(spy.calls.count()).toBe(0);
  });

  describe('entering full screen', () => {
    beforeEach(() => {
      button.click();
      $scope.$digest();
    });

    it('should show the close icon', () => {
      expect(icon()).toHaveClass('fa-compress');
    });

    it('should show the close text', () => {
      expect(button.textContent.trim()).toEqual('Exit Full Screen');
    });

    it('should add the active class to the container', () => {
      expect(fullScreenContainer).toHaveClass('active');
    });

    it('should call the listener with true', () => {
      expect(spy).toHaveBeenCalledOnceWith(true);
    });

    it('should add the full screen class to the body', () => {
      expect(body).toHaveClass('full-screen-container');
    });

    describe('exiting full screen', () => {
      beforeEach(() => {
        button.click();
        $scope.$digest();
      });

      it('should show the open icon', () => {
        expect(icon()).toHaveClass('fa-expand');
      });

      it('should show the open text', () => {
        expect(button.textContent.trim()).toEqual('Full Screen');
      });

      it('should not have the active class on the container', () => {
        expect(fullScreenContainer).not.toHaveClass('active');
      });

      it('should call the listener with false', () => {
        expect(spy).toHaveBeenCalledWith(false);
      });

      it('should remove the full screen class to the body', () => {
        expect(body).not.toHaveClass('full-screen-container');
      });
    });
  });
});
