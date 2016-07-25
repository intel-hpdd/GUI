import highland from 'highland';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('target dashboard', () => {
  let socketStream,
    targetDashboardResolves,
    targetDashboardTargetStream,
    targetDashboardUsageStream,
    s,
    store,
    spy,
    $stateParams;

  beforeEachAsync(async function () {
    s = highland();
    store = {
      select: jasmine
        .createSpy('select')
        .and
        .returnValue(s)
    };

    socketStream = jasmine
      .createSpy('socketStream')
      .and
      .returnValue(s);

    const mod = await mock('source/iml/dashboard/target-dashboard-resolves.js', {
      'source/iml/store/get-store': {
        default: store
      },
      'source/iml/socket/socket-stream': {
        default: socketStream
      }
    });

    ({
      targetDashboardResolves,
      targetDashboardTargetStream,
      targetDashboardUsageStream
    } = mod);

    spy = jasmine.createSpy('spy');

    $stateParams = {

    };
  });

  afterEach(resetAll);

  describe('chart resolves', () => {
    let getFileUsageChart,
      getSpaceUsageChart,
      getMdoChart,
      getReadWriteBandwidthChart,
      getInst;

    beforeEach(() => {
      getFileUsageChart = jasmine
        .createSpy('getFileUsageChart')
        .and
        .returnValue('fileUsageChart');

      getSpaceUsageChart = jasmine
        .createSpy('getSpaceUsageChart')
        .and
        .returnValue('spaceUsageChart');

      getMdoChart = jasmine
        .createSpy('getMdoChart')
        .and
        .returnValue('mdoChart');

      getReadWriteBandwidthChart = jasmine
        .createSpy('getReadWriteBandwidthChart')
        .and
        .returnValue('readWriteBandwidthChart');

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
      expect(targetDashboardResolves)
        .toEqual(jasmine.any(Function));
    });

    describe('MDT', () => {
      let promise;

      beforeEach(function () {
        Object.assign($stateParams, {
          targetId: '1',
          kind: 'MDT'
        });

        promise = getInst();
      });

      it('should call mdoChart', () => {
        expect(getMdoChart)
          .toHaveBeenCalledOnceWith({
            qs: {
              id: '1'
            }
          }, 'target1');
      });

      it('should call fileUsageChart', () => {
        expect(getFileUsageChart)
          .toHaveBeenCalledOnceWith(
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
        expect(getSpaceUsageChart)
          .toHaveBeenCalledOnceWith({
            qs: {
              id: '1'
            }
          }, 'target1');
      });

      itAsync('should return MDT charts', async function () {
        const result = await promise;

        expect(result).toEqual([
          'mdoChart',
          'fileUsageChart',
          'spaceUsageChart'
        ]);
      });
    });

    describe('OST', () => {
      beforeEach(() => {
        Object.assign($stateParams, {
          targetId: '1',
          kind: 'OST'
        });

        getInst();
      });

      it('should call readWriteBandwidthChart', () => {
        expect(getReadWriteBandwidthChart)
          .toHaveBeenCalledOnceWith({
            qs: {
              id: '1'
            }
          }, 'target1');
      });

      it('should call fileUsageChart', () => {
        expect(getFileUsageChart)
          .toHaveBeenCalledOnceWith(
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
        expect(getSpaceUsageChart)
          .toHaveBeenCalledOnceWith({
            qs: {
              id: '1'
            }
          }, 'target1');
      });
    });
  });

  describe('target stream', () => {
    let targetStream;

    beforeEach(() => {
      Object.assign($stateParams, {
        targetId: '1'
      });

      targetStream = targetDashboardTargetStream($stateParams);
    });

    it('should be a function', () => {
      expect(targetDashboardTargetStream)
        .toEqual(jasmine.any(Function));
    });

    it('should call socketStream', () => {
      expect(store.select)
        .toHaveBeenCalledOnceWith('targets');
    });

    it('should stream data', () => {
      targetStream
        .each(spy);
      s
        .write([
          {
            id: '5',
            name: 'target5'
          },
          {
            id: '1',
            name: 'target1'
          }
        ]);

      expect(spy)
        .toHaveBeenCalledOnceWith({
          id: '1',
          name: 'target1'
        });
    });
  });

  describe('usage stream', () => {
    let promise;

    beforeEach(() => {
      Object.assign($stateParams, {
        targetId: '1'
      });

      promise = targetDashboardUsageStream($stateParams);
    });

    it('should call socketStream', () => {
      expect(socketStream)
        .toHaveBeenCalledOnceWith(
          '/target/1/metric/',
        {
          qs: {
            metrics: 'filestotal,filesfree,kbytestotal,kbytesfree',
            latest: true
          }
        }
        );
    });

    itAsync('should stream data', async function () {
      var result;

      s.write([{
        data: {
          kbytesfree: 1000,
          kbytestotal: 2000
        }
      }]);

      const s2 = await promise;
      s2()
        .each(x => result = x);

      expect(result)
        .toEqual({
          kbytesfree: 1000,
          kbytestotal: 2000,
          bytes_free: 1024000,
          bytes_total: 2048000
        });
    });
  });
});
