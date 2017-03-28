import { mock, resetAll } from '../../../system-mock.js';

describe('root panel component', () => {
  let inst, el, doc, overlay, raf;

  beforeEachAsync(async function() {
    raf = jasmine.createSpy('requestAnimationFrame');

    overlay = {
      getBoundingClientRect: () => ({
        width: 1024
      })
    };

    doc = {
      body: {
        appendChild: jasmine.createSpy('appendChild'),
        removeChild: jasmine.createSpy('removeChild')
      },
      createElement: jasmine.createSpy('createElement').and.returnValue(overlay)
    };

    const mod = await mock('source/iml/panels/root-panel-component.js', {
      'source/iml/global.js': {
        default: {
          requestAnimationFrame: raf,
          document: doc
        }
      }
    });

    el = document.createElement('div');

    inst = new mod.Controller([el]);
  });

  afterEach(resetAll);

  describe('on change', () => {
    let spy;

    beforeEach(() => {
      spy = jasmine.createSpy('spy');
      inst.register(spy);
    });

    it('should calculate panel object', () => {
      inst.onChange(50);

      raf.calls.mostRecent().args[0]();

      expect(spy).toHaveBeenCalledOnceWith({
        sideWidthPx: 50,
        sideWidthPercentage: 4.897159647404505,
        mainWidthPercentage: 95.10284035259549,
        mainWidthPx: 971
      });
    });

    it('should calculate the panel object when x < 0', () => {
      inst.onChange(-10);

      raf.calls.mostRecent().args[0]();

      expect(spy).toHaveBeenCalledOnceWith({
        sideWidthPx: 0,
        sideWidthPercentage: 0,
        mainWidthPercentage: 100,
        mainWidthPx: 1021
      });
    });

    it('should calculate the panel object when x > 35%', () => {
      inst.onChange(1000);

      raf.calls.mostRecent().args[0]();

      expect(spy).toHaveBeenCalledOnceWith({
        sideWidthPx: 357.34999999999997,
        sideWidthPercentage: 35,
        mainWidthPercentage: 65,
        mainWidthPx: 663.6500000000001
      });
    });

    it('should not emit if running', () => {
      inst.onChange(1000);
      inst.onChange(1000);

      raf.calls.mostRecent().args[0]();

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should deregister listeners', () => {
      inst.deregister(spy);

      inst.onChange(1000);

      raf.calls.mostRecent().args[0]();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('set active', () => {
    beforeEach(() => {
      inst.setActive();
    });

    it('should add the active class to the element', () => {
      expect(el).toHaveClass('active');
    });

    it('should append the overlay to the body', () => {
      expect(doc.body.appendChild).toHaveBeenCalledOnceWith(overlay);
    });

    describe('set inactive', () => {
      beforeEach(() => {
        inst.setInactive();
      });

      it('should remove the active class from the element', () => {
        expect(el).not.toHaveClass('active');
      });

      it('should remove the overlay from the body', () => {
        expect(doc.body.removeChild).toHaveBeenCalledOnceWith(overlay);
      });
    });
  });

  describe('close', () => {
    let spy;

    beforeEach(() => {
      spy = jasmine.createSpy('spy');
      inst.register(spy);
      inst.close();
      raf.calls.mostRecent().args[0]();
    });

    it('should set side width to 0 pixels', () => {
      expect(spy).toHaveBeenCalledOnceWith({
        sideWidthPx: 0,
        sideWidthPercentage: 0,
        mainWidthPercentage: 100,
        mainWidthPx: 1021
      });
    });
  });

  describe('open', () => {
    let spy;

    beforeEach(() => {
      spy = jasmine.createSpy('spy');
      inst.register(spy);
      inst.open();
      raf.calls.mostRecent().args[0]();
    });

    it('should set side width to 200 pixels', () => {
      expect(spy).toHaveBeenCalledOnceWith({
        sideWidthPx: 200,
        sideWidthPercentage: 19.58863858961802,
        mainWidthPercentage: 80.41136141038197,
        mainWidthPx: 821
      });
    });
  });
});
