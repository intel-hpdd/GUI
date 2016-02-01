export default [
  {
    in: {
      1: [{
        data: {
          stats_read_bytes: 7613151815.7
        },
        ts: '2014-01-07T14:42:50+00:00'
      }],
      2: [{
        data: {
          stats_read_bytes: 7712993095.9
        },
        ts: '2014-01-07T14:42:50+00:00'
      }]
    },
    out: [
      [{
        id: '1',
        name: '1',
        data: { stats_read_bytes: 7613151815.7 },
        ts: '2014-01-07T14:42:50+00:00'
      }],
      [{
        id: '2',
        name: '2',
        data: { stats_read_bytes: 7712993095.9 },
        ts: '2014-01-07T14:42:50+00:00'
      }]
    ]
  }
];
