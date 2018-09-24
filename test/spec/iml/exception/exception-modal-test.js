import exceptionModal from "../../../../source/iml/exception/exception-modal.js";

describe("exception modal", () => {
  let $uibModal, modal;

  beforeEach(() => {
    $uibModal = {
      open: jest.fn()
    };

    modal = exceptionModal($uibModal);
  });

  it("should call the modal with the expected params", () => {
    modal();
    expect($uibModal.open).toHaveBeenCalledWith({
      backdrop: "static",
      windowClass: "exception-modal",
      keyboard: false,
      controller: "ExceptionModalCtrl",
      template:
        '<div class="modal-header"> \
      <h3> \
        <i class="fa fa-exclamation-triangle"></i> \
        Encountered An Error \
      </h3> \
  </div> \
  <div class="modal-body text-center"> \
    <p>An unexpected error has occurred. <br />Please collect iml-diagnostics and send to support.</p> \
  </div> \
  <div class="modal-footer"> \
    <button ng-click="exceptionModal.reload()" class="btn btn-large btn-block" type="button"> \
      <i class="fa fa-refresh"></i> Reload\
    </button> \
  </div>'
    });
  });
});
