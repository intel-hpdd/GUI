describe('exception modal', () => {
  var $modal;

  beforeEach(window.module('exception', ($provide) => {
    $modal = {
      open: jasmine.createSpy('open')
    };

    $provide.value('$modal', $modal);
  }));

  it('should call the modal with the expected params', inject((exceptionModal) => {
    exceptionModal();

    expect($modal.open).toHaveBeenCalledWith({
      backdrop: 'static',
      windowClass: 'exception-modal',
      keyboard: false,
      controller: 'ExceptionModalCtrl',
      template: jasmine.any(String)
    });
  }));
});
