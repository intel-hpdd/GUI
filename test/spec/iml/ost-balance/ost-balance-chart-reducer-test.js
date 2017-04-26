import {
  UPDATE_OST_BALANCE_CHART_ITEMS,
  DEFAULT_OST_BALANCE_CHART_ITEMS,
  default as ostBalanceChartReducer
} from '../../../../source/iml/ost-balance/ost-balance-chart-reducer.js';
import deepFreeze from '@mfl/deep-freeze';

describe('ost balance reducer', () => {
  it('should be a function', () => {
    expect(ostBalanceChartReducer).toEqual(jasmine.any(Function));
  });

  describe('matching type', () => {
    describe('DEFAULT case', () => {
      describe('without page data', () => {
        it('should write the intial payload for the page', () => {
          expect(
            ostBalanceChartReducer(
              {
                base: {
                  percentage: 0,
                  page: 'base'
                }
              },
              {
                type: DEFAULT_OST_BALANCE_CHART_ITEMS,
                payload: {
                  percentage: 15,
                  page: 'fs1'
                }
              }
            )
          ).toEqual({
            base: {
              percentage: 0,
              page: 'base'
            },
            fs1: {
              percentage: 15,
              page: 'fs1'
            }
          });
        });
      });

      describe('with page data', () => {
        it('should NOT write the payload for the page', () => {
          expect(
            ostBalanceChartReducer(
              {
                base: {
                  percentage: 5,
                  page: 'base'
                }
              },
              {
                type: DEFAULT_OST_BALANCE_CHART_ITEMS,
                payload: {
                  percentage: 15,
                  page: 'base'
                }
              }
            )
          ).toEqual({
            base: {
              percentage: 5,
              page: 'base'
            }
          });
        });
      });
    });

    describe('UPDATE case', () => {
      it('should update the state', () => {
        expect(
          ostBalanceChartReducer(
            {
              '': {
                percentage: 0,
                page: ''
              },
              target8: {
                percentage: 5,
                page: 'target8'
              }
            },
            {
              type: UPDATE_OST_BALANCE_CHART_ITEMS,
              payload: {
                percentage: 15,
                page: 'target8'
              }
            }
          )
        ).toEqual({
          '': {
            percentage: 0,
            page: ''
          },
          target8: {
            percentage: 15,
            page: 'target8'
          }
        });
      });
    });
  });

  describe('non-matching type', () => {
    it('should return the state', () => {
      expect(
        ostBalanceChartReducer(deepFreeze([]), {
          type: 'ADD_ALERT_INDICATOR_ITEMS',
          payload: { key: 'val' }
        })
      ).toEqual([]);
    });
  });
});
