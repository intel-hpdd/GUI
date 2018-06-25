import deepFreeze from '@iml/deep-freeze';

describe('lnet configuration reducer', () => {
  let lnetConfigurationReducer;
  beforeEach(() => {
    jest.mock('../../../../source/iml/lnet/lnet-module.js', () => ({
      ADD_LNET_CONFIGURATION_ITEMS: 'ADD_LNET_CONFIGURATION_ITEMS'
    }));
    lnetConfigurationReducer = require('../../../../source/iml/lnet/lnet-configuration-reducer.js').default;
  });

  it('should be a function', () => {
    expect(lnetConfigurationReducer).toEqual(expect.any(Function));
  });

  describe('matching type', () => {
    it('should return the payload', () => {
      expect(
        lnetConfigurationReducer(deepFreeze([]), {
          type: 'ADD_LNET_CONFIGURATION_ITEMS',
          payload: [{}]
        })
      ).toEqual([{}]);
    });
  });

  describe('non-matching type', () => {
    it('should return the state', () => {
      expect(
        lnetConfigurationReducer(deepFreeze([]), {
          type: 'ADD_ALERT_INDICATOR_ITEMS',
          payload: { key: 'val' }
        })
      ).toEqual([]);
    });
  });
});
