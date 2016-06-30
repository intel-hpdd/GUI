import {
  ADD_MDO_CHART_ITEMS,
  default as mdoChartReducer
} from '../../../../source/iml/mdo/mdo-chart-reducer.js';
import deepFreeze from 'intel-deep-freeze';

describe('server reducer', () => {

  it('should be a function', () => {
    expect(mdoChartReducer).toEqual(jasmine.any(Function));
  });

  describe('matching type', () => {
    it('should return the payload', () => {
      expect(
        mdoChartReducer(
          {
            '': {
              configType: 'range',
              startDate: 'startDate',
              endDate: 'endDate',
              size: 10,
              unit: 'minutes',
              page: ''
            }
          },
          {
            type: ADD_MDO_CHART_ITEMS,
            payload: [{
              configType: 'duration',
              startDate: 'startDate',
              endDate: 'endDate',
              size: 3,
              unit: 'hours',
              page: 'target8'
            }]
          }
        )
      )
      .toEqual(
        {
          '': {
            configType: 'range',
            startDate: 'startDate',
            endDate: 'endDate',
            size: 10,
            unit: 'minutes',
            page: ''
          },
          'target8': {
            configType: 'duration',
            startDate: 'startDate',
            endDate: 'endDate',
            size: 3,
            unit: 'hours',
            page: 'target8'
          }
        }
      );
    });
  });

  describe('updating a matching type', () => {
    it('should return the payload', () => {
      expect(
        mdoChartReducer(
          {
            '': {
              configType: 'range',
              startDate: 'startDate',
              endDate: 'endDate',
              size: 10,
              unit: 'minutes',
              page: ''
            },
            'target8': {
              configType: 'duration',
              startDate: 'startDate',
              endDate: 'endDate',
              size: 3,
              unit: 'hours',
              page: 'target8'
            }
          },
          {
            type: ADD_MDO_CHART_ITEMS,
            payload: [{
              configType: 'duration',
              startDate: 'startDate',
              endDate: 'endDate',
              size: 50,
              unit: 'minutes',
              page: 'target8'
            }]
          }
        )
      )
      .toEqual(
        {
          '': {
            configType: 'range',
            startDate: 'startDate',
            endDate: 'endDate',
            size: 10,
            unit: 'minutes',
            page: ''
          },
          'target8': {
            configType: 'duration',
            startDate: 'startDate',
            endDate: 'endDate',
            size: 50,
            unit: 'minutes',
            page: 'target8'
          }
        }
      );
    });
  });

  describe('non-matching type', () => {
    it('should return the state', () => {
      expect(mdoChartReducer(deepFreeze([]), {
        type: 'ADD_ALERT_INDICATOR_ITEMS',
        payload: {key: 'val'}
      })).toEqual([]);
    });
  });
});
