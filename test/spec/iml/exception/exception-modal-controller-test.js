import exceptionModalController from '../../../../source/iml/exception/exception-modal-controller.js';

describe('Exception modal controller', () => {
  let $scope, $document;
  beforeEach(() => {
    $scope = {};
    $document = [
      {
        location: {
          reload: jest.fn(() => 'reload')
        }
      }
    ];

    exceptionModalController($scope, $document);
  });

  it('should set an exceptionModal property on the $scope', () => {
    expect($scope.exceptionModal).toEqual({
      reload: expect.any(Function)
    });
  });

  it('should reload the document when invoking $scope.exceptionModal.reload', () => {
    $scope.exceptionModal.reload();
    expect($document[0].location.reload).toHaveBeenCalledWith(true);
  });
});
