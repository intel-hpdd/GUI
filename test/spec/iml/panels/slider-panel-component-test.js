describe('slider panel', () => {
  let inst, rootPanel, mockDoc;

  beforeEach(() => {
    mockDoc = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };

    jest.mock('../../../../source/iml/global.js', () => ({
      document: mockDoc
    }));

    const mod = require('../../../../source/iml/panels/slider-panel-component.js');

    rootPanel = {
      setActive: jest.fn(),
      setInactive: jest.fn(),
      onChange: jest.fn()
    };

    inst = new mod.Controller();
    inst.rootPanel = rootPanel;
  });

  describe('on mousedown', () => {
    beforeEach(() => {
      inst.onMouseDown();
    });

    it('should set panel to active', () => {
      expect(rootPanel.setActive).toHaveBeenCalledTimes(1);
    });

    it('should add mousemove listener', () => {
      expect(mockDoc.addEventListener).toHaveBeenCalledOnceWith(
        'mousemove',
        expect.any(Function)
      );
    });

    it('should add mouseup listener', () => {
      expect(mockDoc.addEventListener).toHaveBeenCalledOnceWith(
        'mouseup',
        expect.any(Function)
      );
    });

    describe('on mousemove', () => {
      beforeEach(() => {
        mockDoc.addEventListener.mock.calls[0][1]({
          clientX: 10
        });
      });

      it('should trigger rootPanel onChange', () => {
        expect(rootPanel.onChange).toHaveBeenCalledOnceWith(10);
      });
    });

    describe('on mouseup', () => {
      beforeEach(() => {
        mockDoc.addEventListener.mock.calls[1][1]();
      });

      it('should set panel to inactive', () => {
        expect(rootPanel.setInactive).toHaveBeenCalledTimes(1);
      });

      it('should remove mousemove listener', () => {
        expect(mockDoc.removeEventListener).toHaveBeenCalledOnceWith(
          'mousemove',
          expect.any(Function)
        );
      });

      it('should remove mouseup listener', () => {
        expect(mockDoc.removeEventListener).toHaveBeenCalledOnceWith(
          'mouseup',
          expect.any(Function)
        );
      });
    });
  });
});
