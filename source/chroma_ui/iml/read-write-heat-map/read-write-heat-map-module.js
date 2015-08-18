angular.module('readWriteHeatMap', ['charting', 'highland', 'socket-module', 'charts', 'durationPicker'])
  .constant('readWriteHeatMapTypes', {
    READ_BYTES: 'stats_read_bytes',
    WRITE_BYTES: 'stats_write_bytes',
    READ_IOPS: 'stats_read_iops',
    WRITE_IOPS: 'stats_write_iops'
  });
