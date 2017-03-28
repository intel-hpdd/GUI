import { mock, resetAll } from '../../../system-mock.js';

describe('slider panel', () => {
  let inst, rootPanel;

  beforeEachAsync(async function() {
    const mod = await mock('source/iml/panels/toggle-side-panel-component.js', {
    });

    rootPanel = {
      open: jasmine.createSpy('open'),
      close: jasmine.createSpy('close')
    };

    inst = new mod.Controller();
    inst.rootPanel = rootPanel;
  });

  afterEach(resetAll);

  describe('one click', () => {
    beforeEach(() => {
      inst.onClick();
    });

    it('should call close', () => {
      expect(rootPanel.close).toHaveBeenCalledOnce();
    });

    it('should not call open', () => {
      expect(rootPanel.open).not.toHaveBeenCalledOnce();
    });
  });

  describe('two clicks', () => {
    beforeEach(() => {
      inst.onClick();
      inst.onClick();
    });

    it('should call open', () => {
      expect(rootPanel.open).toHaveBeenCalledOnce();
    });

    it('should not call close once', () => {
      expect(rootPanel.close).toHaveBeenCalledOnce();
    });
  });
});
