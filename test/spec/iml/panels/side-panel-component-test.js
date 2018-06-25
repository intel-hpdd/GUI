import { Controller } from '../../../../source/iml/panels/side-panel-component.js';

describe('side panel component', () => {
  let el, inst, rootPanel;

  beforeEach(() => {
    el = {
      style: []
    };

    rootPanel = {
      register: jest.fn(),
      deregister: jest.fn()
    };

    inst = new Controller([el]);
    inst.rootPanel = rootPanel;
    inst.$onInit();
  });

  it('should register', () => {
    expect(rootPanel.register).toHaveBeenCalledOnceWith(expect.any(Function));
  });

  it('should set flex-basis on change', () => {
    const setWidth = rootPanel.register.mock.calls[0][0];

    setWidth({
      sideWidthPercentage: 25
    });

    expect(el.style.flexBasis).toBe('25%');
  });

  describe('on destroy', () => {
    beforeEach(() => {
      inst.$onDestroy();
    });

    it('should deregister', () => {
      expect(rootPanel.deregister).toHaveBeenCalledOnceWith(expect.any(Function));
    });
  });
});
