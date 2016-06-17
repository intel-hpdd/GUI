import {
  ADD_OST_BALANCE_CHART_ITEMS,
  default as ostBalanceChartReducer
} from '../../../../source/iml/ost-balance/ost-balance-chart-reducer.js';
import deepFreeze from 'intel-deep-freeze';

describe('server reducer', () => {

  it('should be a function', () => {
    expect(ostBalanceChartReducer).toEqual(jasmine.any(Function));
  });

  describe('matching type', () => {
    it('should return the payload', () => {
      expect(
        ostBalanceChartReducer(
          {
            '': {
              percentage: 10,
              page: ''
            }
          },
          {
            type: ADD_OST_BALANCE_CHART_ITEMS,
            payload: [{
              percentage: 85,
              page: '8'
            }]
          }
        )
      )
      .toEqual(
        {
          '': {
            percentage: 10,
            page: ''
          },
          '8': {
            percentage: 85,
            page: '8'
          }
        }
      );
    });
  });

  describe('updating a matching type', () => {
    it('should return the payload', () => {
      expect(
        ostBalanceChartReducer(
          {
            '': {
              percentage: 10,
              page: ''
            },
            '8': {
              percentage: 85,
              page: '8'
            }
          },
          {
            type: ADD_OST_BALANCE_CHART_ITEMS,
            payload: [{
              percentage: 23,
              page: '8'
            }]
          }
        )
      )
      .toEqual(
        {
          '': {
            percentage: 10,
            page: ''
          },
          '8': {
            percentage: 23,
            page: '8'
          }
        }
      );
    });
  });

  describe('non-matching type', () => {
    it('should return the state', () => {
      expect(ostBalanceChartReducer(deepFreeze([]), {
        type: 'ADD_ALERT_INDICATOR_ITEMS',
        payload: {key: 'val'}
      })).toEqual([]);
    });
  });
});
