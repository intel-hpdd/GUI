import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('side panel component', () => {
  let el,
    inst,
    rootPanel;

  beforeEachAsync(async function () {
    const mod = await mock(
      'source/iml/panels/side-panel-component.js',
      {}
    );

    el = {
      style: []
    };

    rootPanel = {
      register: jasmine.createSpy('register'),
      deregister: jasmine.createSpy('deregister')
    };

    inst = new mod.Controller([el]);
    inst.rootPanel = rootPanel;
    inst.$onInit();
  });

  afterEach(resetAll);

  it('should register', () => {
    expect(rootPanel.register)
      .toHaveBeenCalledOnceWith(jasmine.any(Function));
  });

  it('should set flex-basis on change', () => {
    const setWidth = rootPanel
      .register
      .calls
      .mostRecent()
      .args[0];

    setWidth({
      sideWidthPercentage: 25
    });


    expect(el.style.flexBasis)
      .toBe('25%');
  });

  describe('on destroy', () => {
    beforeEach(() => {
      inst.$onDestroy();
    });

    it('should deregister', () => {
      expect(rootPanel.deregister)
        .toHaveBeenCalledOnceWith(jasmine.any(Function));
    });
  });
});
