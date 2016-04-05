import {
  ADD_LNET_CONFIGURATION_ITEMS,
  default as lnetConfigurationReducer
} from '../../../../source/iml/lnet/lnet-configuration-reducer.js';
import deepFreeze from 'intel-deep-freeze';

describe('lnet configuration reducer', () => {

  it('should be a function', () => {
    expect(lnetConfigurationReducer).toEqual(jasmine.any(Function));
  });

  describe('matching type', () => {
    it('should return the payload', () => {
      expect(lnetConfigurationReducer(deepFreeze([]), {
        type: ADD_LNET_CONFIGURATION_ITEMS,
        payload: [{}]
      })).toEqual([{}]);
    });
  });

  describe('non-matching type', () => {
    it('should return the state', () => {
      expect(lnetConfigurationReducer(deepFreeze([]), {
        type: 'ADD_ALERT_INDICATOR_ITEMS',
        payload: {key: 'val'}
      })).toEqual([]);
    });
  });
});
