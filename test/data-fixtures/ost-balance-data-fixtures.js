import angular from 'angular';

angular.module('dataFixtures').value('ostBalanceDataFixtures', [
  {
    in: {
      18: [
        {
          data: {
            kbytesfree: 1980009,
            kbytestotal: 2015824
          },
          ts: '2013-11-18T22:45:30+00:00',
          id: '18'
        }
      ],
      19: [
        {
          data: {
            kbytesfree: 2015824,
            kbytestotal: 2015824
          },
          ts: '2013-11-18T22:45:30+00:00',
          id: '19'
        }
      ],
      20: []
    },
    out: [
      {
        key: 'Used bytes',
        values: [
          {
            x: '18',
            y: 0.01776692806514857,
            detail: {
              percentFree: 98,
              percentUsed: 2,
              bytesFree: '1.888 GB',
              bytesUsed: '34.98 MB',
              bytesTotal: '1.922 GB'
            }
          },
          {
            x: '19',
            y: 0,
            detail: {
              percentFree: 100,
              percentUsed: 0,
              bytesFree: '1.922 GB',
              bytesUsed: '0.000 B',
              bytesTotal: '1.922 GB'
            }
          }
        ]
      },
      {
        key: 'Free bytes',
        values: [
          {
            x: '18',
            y: 0.9822330719348514,
            detail: {
              percentFree: 98,
              percentUsed: 2,
              bytesFree: '1.888 GB',
              bytesUsed: '34.98 MB',
              bytesTotal: '1.922 GB'
            }
          },
          {
            x: '19',
            y: 1,
            detail: {
              percentFree: 100,
              percentUsed: 0,
              bytesFree: '1.922 GB',
              bytesUsed: '0.000 B',
              bytesTotal: '1.922 GB'
            }
          }
        ]
      }
    ]
  }
]);
