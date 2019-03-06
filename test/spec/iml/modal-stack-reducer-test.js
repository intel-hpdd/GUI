import {
  default as modalStackReducer,
  MODAL_STACK_ADD_MODAL,
  MODAL_STACK_REMOVE_MODAL
} from "../../../source/iml/modal-stack-reducer.js";

describe("modal stack reducer", () => {
  let result;
  describe("when receiving the MODAL_STACK_ADD_MODAL type", () => {
    it("should return the stack", () => {
      result = modalStackReducer([], {
        type: MODAL_STACK_ADD_MODAL,
        payload: "my_modal_name"
      });
      expect(result).toEqual(["my_modal_name"]);
    });
  });

  describe("when receiving the MODAL_STACK_REMOVE_MODAL type", () => {
    it("should return the stack", () => {
      result = modalStackReducer(["my_modal_name"], {
        type: MODAL_STACK_REMOVE_MODAL,
        payload: "my_modal_name"
      });
      expect(result).toEqual([]);
    });
  });

  describe("when receiving a combination of MODAL_STACK_ADD_MODAL and MODAL_STACK_REMOVE_MODAL requests", () => {
    it("should return the stack", () => {
      result = modalStackReducer([], {
        type: MODAL_STACK_ADD_MODAL,
        payload: "my_modal_name"
      });
      result = modalStackReducer(result, {
        type: MODAL_STACK_ADD_MODAL,
        payload: "my_modal_name2"
      });
      result = modalStackReducer(result, {
        type: MODAL_STACK_REMOVE_MODAL,
        payload: "my_modal_name"
      });
      result = modalStackReducer(result, {
        type: MODAL_STACK_ADD_MODAL,
        payload: "my_modal_name3"
      });
      expect(result).toEqual(["my_modal_name3", "my_modal_name2"]);
    });
  });

  describe("when receiving the MODAL_STACK_REMOVE_MODAL type for an item that isn't on the stack", () => {
    it("should not remove the item from the stack", () => {
      result = modalStackReducer(["my_modal_name"], {
        type: MODAL_STACK_REMOVE_MODAL,
        payload: "bla"
      });
      expect(result).toEqual(["my_modal_name"]);
    });
  });

  describe("when receiving a non-registered type", () => {
    it("should not remove the item from the stack", () => {
      result = modalStackReducer(["my_modal_name"], {
        type: "non-registered-type",
        payload: "bla"
      });
      expect(result).toEqual(["my_modal_name"]);
    });
  });
});
