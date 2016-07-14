import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('side panel component', () => {
  let el, inst, panels;

  beforeEachAsync(async function () {
    const mod = await mock(
      'source/iml/panels/side-panel-component.js',
      {}
    );

    el = {
      style: []
    };

    panels = {
      register: jasmine.createSpy('register'),
      deregister: jasmine.createSpy('deregister')
    };

    inst = new mod.Controller([el]);
    inst.panels = panels;
    inst.$onInit();
  });

  afterEach(resetAll);

  it('should register', () => {
    expect(panels.register)
      .toHaveBeenCalledOnceWith(jasmine.any(Function));
  });

  it('should set flex-basis on change', () => {
    const setWidth = panels
      .register
      .calls
      .mostRecent()
      .args[0];

    setWidth({
      sideWidthPercentage: 25
    });


    expect(el.style['flex-basis'])
      .toBe('25%');
  });

  describe('on destroy', () => {
    beforeEach(() => {
      inst.$onDestroy();
    });

    it('should deregister', () => {
      expect(panels.deregister)
        .toHaveBeenCalledOnceWith(jasmine.any(Function));
    });
  });
});
