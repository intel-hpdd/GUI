import { getReadWriteHeatMapStreamFactory } from './get-read-write-heat-map-stream-exports';
import { getReadWriteHeatMapChartFactory } from './get-read-write-heat-map-chart-exports';

angular
  .module('readWriteHeatMap', ['charting', 'highland', 'socket-module', 'charts', 'durationPicker'])
  .constant('readWriteHeatMapTypes', {
    READ_BYTES: 'stats_read_bytes',
    WRITE_BYTES: 'stats_write_bytes',
    READ_IOPS: 'stats_read_iops',
    WRITE_IOPS: 'stats_write_iops'
  })
  .factory('getReadWriteHeatMapStream', getReadWriteHeatMapStreamFactory)
  .factory('getReadWriteHeatMapChart', getReadWriteHeatMapChartFactory);
