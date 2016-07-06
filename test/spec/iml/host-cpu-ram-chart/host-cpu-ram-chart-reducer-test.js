import {
  UPDATE_HOST_CPU_RAM_CHART_ITEMS,
  DEFAULT_HOST_CPU_RAM_CHART_ITEMS,
  default as hostCpuRamChartReducer
} from '../../../../source/iml/host-cpu-ram-chart/host-cpu-ram-chart-reducer.js';
import deepFreeze from 'intel-deep-freeze';

describe('Host CPU Ram Chart reducer', () => {

  it('should be a function', () => {
    expect(hostCpuRamChartReducer).toEqual(jasmine.any(Function));
  });

  describe('matching type', () => {
    describe('DEFAULT case', () => {
      describe('without page data', () => {
        it('should write the intial payload for the page', () => {
          expect(
            hostCpuRamChartReducer(
              {
                'base': {
                  configType: 'duration',
                  startDate: 'startDate',
                  endDate: 'endDate',
                  size: 3,
                  unit: 'hours',
                  page: 'base'
                }
              },
              {
                type: DEFAULT_HOST_CPU_RAM_CHART_ITEMS,
                payload: {
                  configType: 'duration',
                  startDate: 'startDate',
                  endDate: 'endDate',
                  size: 15,
                  unit: 'minutes',
                  page: 'fs1'
                }
              }
            )
          )
          .toEqual(
            {
              'base': {
                configType: 'duration',
                startDate: 'startDate',
                endDate: 'endDate',
                size: 3,
                unit: 'hours',
                page: 'base'
              },
              'fs1': {
                configType: 'duration',
                startDate: 'startDate',
                endDate: 'endDate',
                size: 15,
                unit: 'minutes',
                page: 'fs1'
              }
            }
          );
        });
      });

      describe('with page data', () => {
        it('should NOT write the payload for the page', () => {
          expect(
            hostCpuRamChartReducer(
              {
                'base': {
                  configType: 'duration',
                  startDate: 'startDate',
                  endDate: 'endDate',
                  size: 3,
                  unit: 'hours',
                  page: 'base'
                }
              },
              {
                type: DEFAULT_HOST_CPU_RAM_CHART_ITEMS,
                payload: {
                  configType: 'duration',
                  startDate: 'startDate',
                  endDate: 'endDate',
                  size: 15,
                  unit: 'minutes',
                  page: 'base'
                }
              }
            )
          )
          .toEqual(
            {
              'base': {
                configType: 'duration',
                startDate: 'startDate',
                endDate: 'endDate',
                size: 3,
                unit: 'hours',
                page: 'base'
              }
            }
          );
        });
      });
    });

    describe('UPDATE case', () => {
      it('should update the state', () => {
        expect(
          hostCpuRamChartReducer(
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
              type: UPDATE_HOST_CPU_RAM_CHART_ITEMS,
              payload: {
                configType: 'duration',
                size: 15,
                unit: 'minutes',
                page: 'target8'
              }
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
              size: 15,
              unit: 'minutes',
              page: 'target8'
            }
          }
        );
      });
    });
  });

  describe('non-matching type', () => {
    it('should return the state', () => {
      expect(hostCpuRamChartReducer(deepFreeze([]), {
        type: 'ADD_ALERT_INDICATOR_ITEMS',
        payload: {key: 'val'}
      })).toEqual([]);
    });
  });
});
