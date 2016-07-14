import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('slider panel', () => {
  let inst, panels, doc;

  beforeEachAsync(async function () {
    doc = {
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener')
    };

    const mod = await mock('source/iml/panels/slider-panel-component.js', {
      'source/iml/global.js': {
        default: {
          document: doc
        }
      }
    });

    panels = {
      setActive: jasmine.createSpy('setActive'),
      setInactive: jasmine.createSpy('register'),
      onChange: jasmine.createSpy('onChange')
    };

    inst = new mod.Controller();
    inst.panels = panels;
  });

  afterEach(resetAll);

  describe('on mousedown', () => {
    beforeEach(() => {
      inst.onMouseDown();
    });

    it('should set panel to active', () => {
      expect(panels.setActive)
        .toHaveBeenCalledOnce();
    });

    it('should add mousemove listener', () => {
      expect(doc.addEventListener)
        .toHaveBeenCalledOnceWith('mousemove', jasmine.any(Function));
    });

    it('should add mouseup listener', () => {
      expect(doc.addEventListener)
        .toHaveBeenCalledOnceWith('mouseup', jasmine.any(Function));
    });

    describe('on mousemove', () => {
      beforeEach(() => {
        doc.addEventListener.calls.argsFor(0)[1]({
          x: 10
        });
      });

      it('should trigger panels onChange', () => {
        expect(panels.onChange)
          .toHaveBeenCalledOnceWith(10);
      });
    });

    describe('on mouseup', () => {
      beforeEach(() => {
        doc.addEventListener.calls.argsFor(1)[1]();
      });

      it('should set panel to inactive', () => {
        expect(panels.setInactive)
          .toHaveBeenCalledOnce();
      });

      it('should remove mousemove listener', () => {
        expect(doc.removeEventListener)
          .toHaveBeenCalledOnceWith('mousemove', jasmine.any(Function));
      });

      it('should remove mouseup listener', () => {
        expect(doc.removeEventListener)
          .toHaveBeenCalledOnceWith('mouseup', jasmine.any(Function));
      });
    });
  });
});
