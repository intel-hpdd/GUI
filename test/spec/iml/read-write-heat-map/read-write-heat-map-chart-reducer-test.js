import {
  ADD_READ_WRITE_HEAT_MAP_CHART_ITEMS,
  default as readWriteHeatMapChartReducer
} from '../../../../source/iml/read-write-heat-map/read-write-heat-map-chart-reducer.js';
import deepFreeze from 'intel-deep-freeze';

describe('server reducer', () => {

  it('should be a function', () => {
    expect(readWriteHeatMapChartReducer).toEqual(jasmine.any(Function));
  });

  describe('matching type', () => {
    it('should return the payload', () => {
      expect(readWriteHeatMapChartReducer({
        '': {
          dataType: 'dataType',
          configType: 'range',
          startDate: 'startDate',
          endDate: 'endDate',
          size: 10,
          unit: 'minutes',
          page: ''
        }
      },
        {
          type: ADD_READ_WRITE_HEAT_MAP_CHART_ITEMS,
          payload: [{
            dataType: 'dataType',
            configType: 'duration',
            startDate: 'startDate',
            endDate: 'endDate',
            size: 3,
            unit: 'hours',
            page: 'target8'
          }]
        })).toEqual({
          '': {
            dataType: 'dataType',
            configType: 'range',
            startDate: 'startDate',
            endDate: 'endDate',
            size: 10,
            unit: 'minutes',
            page: ''
          }, 'target8': {
            dataType: 'dataType',
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
      expect(readWriteHeatMapChartReducer({
        '': {
          dataType: 'dataType',
          configType: 'range',
          startDate: 'startDate',
          endDate: 'endDate',
          size: 10,
          unit: 'minutes',
          page: ''
        },
        'target8': {
          dataType: 'dataType',
          configType: 'duration',
          startDate: 'startDate',
          endDate: 'endDate',
          size: 3,
          unit: 'hours',
          page: 'target8'
        }
      },
        {
          type: ADD_READ_WRITE_HEAT_MAP_CHART_ITEMS,
          payload: [{
            dataType: 'dataType',
            configType: 'duration',
            startDate: 'startDate',
            endDate: 'endDate',
            size: 15,
            unit: 'minutes',
            page: 'target8'
          }]
        })).toEqual({
          '': {
            dataType: 'dataType',
            configType: 'range',
            startDate: 'startDate',
            endDate: 'endDate',
            size: 10,
            unit: 'minutes',
            page: ''
          }, 'target8': {
            dataType: 'dataType',
            configType: 'duration',
            startDate: 'startDate',
            endDate: 'endDate',
            size: 15,
            unit: 'minutes',
            page: 'target8'
          }
        }
      );
    });
  });

  describe('non-matching type', () => {
    it('should return the state', () => {
      expect(readWriteHeatMapChartReducer(deepFreeze([]), {
        type: 'ADD_ALERT_INDICATOR_ITEMS',
        payload: {key: 'val'}
      })).toEqual([]);
    });
  });
});
