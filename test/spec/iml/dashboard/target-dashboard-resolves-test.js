import highland from 'highland';

describe('target dashboard', () => {
  let mockSocketStream,
    targetDashboardResolves,
    targetDashboardTargetStream,
    targetDashboardUsageStream,
    s,
    mockStore,
    spy,
    $stateParams;

  beforeEach(() => {
    s = highland();
    mockStore = {
      select: jest.fn(() => s)
    };

    mockSocketStream = jest.fn(() => s);

    jest.mock('../../../../source/iml/store/get-store.js', () => mockStore);
    jest.mock('../../../../source/iml/socket/socket-stream.js', () => mockSocketStream);

    const mod = require('../../../../source/iml/dashboard/target-dashboard-resolves.js');

    ({ targetDashboardResolves, targetDashboardTargetStream, targetDashboardUsageStream } = mod);

    spy = jest.fn();

    $stateParams = {};
  });

  describe('chart resolves', () => {
    let getFileUsageChart, getSpaceUsageChart, getMdoChart, getReadWriteBandwidthChart, getInst;

    beforeEach(() => {
      getFileUsageChart = jest.fn(() => 'fileUsageChart');

      getSpaceUsageChart = jest.fn(() => 'spaceUsageChart');

      getMdoChart = jest.fn(() => 'mdoChart');

      getReadWriteBandwidthChart = jest.fn(() => 'readWriteBandwidthChart');

      getInst = targetDashboardResolves.bind(
        null,
        $stateParams,
        getFileUsageChart,
        getSpaceUsageChart,
        getMdoChart,
        getReadWriteBandwidthChart
      );
    });

    it('should return a function', () => {
      expect(targetDashboardResolves).toEqual(expect.any(Function));
    });

    describe('MDT', () => {
      let promise;

      beforeEach(() => {
        Object.assign($stateParams, {
          id: '1',
          kind: 'MDT'
        });

        promise = getInst();
      });

      it('should call mdoChart', () => {
        expect(getMdoChart).toHaveBeenCalledOnceWith(
          {
            qs: {
              id: '1'
            }
          },
          'target1'
        );
      });

      it('should call fileUsageChart', () => {
        expect(getFileUsageChart).toHaveBeenCalledOnceWith(
          'File Usage',
          'Files Used',
          {
            qs: {
              id: '1'
            }
          },
          'target1'
        );
      });

      it('should call spaceUsageChart', () => {
        expect(getSpaceUsageChart).toHaveBeenCalledOnceWith(
          {
            qs: {
              id: '1'
            }
          },
          'target1'
        );
      });

      it('should return MDT charts', async () => {
        const result = await promise;

        expect(result).toEqual(['mdoChart', 'fileUsageChart', 'spaceUsageChart']);
      });
    });

    describe('OST', () => {
      beforeEach(() => {
        Object.assign($stateParams, {
          id: '1',
          kind: 'OST'
        });

        getInst();
      });

      it('should call readWriteBandwidthChart', () => {
        expect(getReadWriteBandwidthChart).toHaveBeenCalledOnceWith(
          {
            qs: {
              id: '1'
            }
          },
          'target1'
        );
      });

      it('should call fileUsageChart', () => {
        expect(getFileUsageChart).toHaveBeenCalledOnceWith(
          'Object Usage',
          'Objects Used',
          {
            qs: {
              id: '1'
            }
          },
          'target1'
        );
      });

      it('should call spaceUsageChart', () => {
        expect(getSpaceUsageChart).toHaveBeenCalledOnceWith(
          {
            qs: {
              id: '1'
            }
          },
          'target1'
        );
      });
    });
  });

  describe('target stream', () => {
    let targetStream;

    beforeEach(() => {
      Object.assign($stateParams, {
        id: '1'
      });

      targetStream = targetDashboardTargetStream($stateParams);
    });

    it('should be a function', () => {
      expect(targetDashboardTargetStream).toEqual(expect.any(Function));
    });

    it('should call select on the store', () => {
      expect(mockStore.select).toHaveBeenCalledOnceWith('targets');
    });

    it('should stream data', () => {
      targetStream.each(spy);
      s.write([
        {
          id: 5,
          name: 'target5'
        },
        {
          id: 1,
          name: 'target1'
        }
      ]);

      expect(spy).toHaveBeenCalledWith({
        id: 1,
        name: 'target1'
      });
    });
  });

  describe('usage stream', () => {
    let promise;

    beforeEach(() => {
      Object.assign($stateParams, {
        id: '1'
      });

      promise = targetDashboardUsageStream($stateParams);
    });

    it('should call socketStream', () => {
      expect(mockSocketStream).toHaveBeenCalledOnceWith('/target/1/metric/', {
        qs: {
          metrics: 'filestotal,filesfree,kbytestotal,kbytesfree',
          latest: true
        }
      });
    });

    it('should stream data', async () => {
      let result;

      s.write([
        {
          data: {
            kbytesfree: 1000,
            kbytestotal: 2000
          }
        }
      ]);

      const s2 = await promise;
      s2().each(x => (result = x));

      expect(result).toEqual({
        kbytesfree: 1000,
        kbytestotal: 2000,
        bytes_free: 1024000,
        bytes_total: 2048000
      });
    });
  });
});
