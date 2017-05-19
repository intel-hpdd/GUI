import mgtPageComponent from '../../../../source/iml/mgt/mgt-page-component.js';

describe('mgt page component', () => {
  it('should be a component', () => {
    expect(mgtPageComponent).toEqual({
      bindings: {
        mgt$: '<',
        mgtAlertIndicatorB: '<',
        mgtJobIndicatorB: '<'
      },
      template: expect.any(String)
    });
  });
});
