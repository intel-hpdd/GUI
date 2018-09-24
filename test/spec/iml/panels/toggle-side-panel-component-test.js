describe("slider panel", () => {
  let inst, rootPanel;

  beforeEach(() => {
    const mod = require("../../../../source/iml/panels/toggle-side-panel-component.js");

    rootPanel = {
      open: jest.fn(),
      close: jest.fn()
    };

    inst = new mod.Controller();
    inst.rootPanel = rootPanel;
  });

  describe("one click", () => {
    beforeEach(() => {
      inst.onClick();
    });

    it("should call close", () => {
      expect(rootPanel.close).toHaveBeenCalledTimes(1);
    });

    it("should not call open", () => {
      expect(rootPanel.open).not.toHaveBeenCalledTimes(1);
    });
  });

  describe("two clicks", () => {
    beforeEach(() => {
      inst.onClick();
      inst.onClick();
    });

    it("should call open", () => {
      expect(rootPanel.open).toHaveBeenCalledTimes(1);
    });

    it("should not call close once", () => {
      expect(rootPanel.close).toHaveBeenCalledTimes(1);
    });
  });
});
