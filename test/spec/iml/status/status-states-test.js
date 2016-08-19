import {
  mock,
  resetAll
} from '../../../system-mock.js';

import {
  noSpace
} from '../../../../source/iml/string.js';

describe('status states', () => {
  let mod, resolveStream, socketStream;

  beforeEachAsync(async function () {
    resolveStream = jasmine.createSpy('resolveStream');
    socketStream = jasmine.createSpy('socketStream');

    mod = await mock('source/iml/status/status-states.js', {
      'source/iml/promise-transforms.js': { resolveStream },
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });
  });

  afterEach(resetAll);

  describe('status state', () => {
    it('should create the state', () => {
      expect(mod.statusState)
        .toEqual({
          name: 'app.status',
          data: {
            helpPage: 'status_page.htm',
            anonymousReadProtected: true,
            eulaState: true,
            skipWhen: jasmine.any(Function)
          },
          template: jasmine.any(String)
        });
    });
  });

  describe('query state', () => {
    it('should create the state', () => {
      expect(mod.queryState)
        .toEqual({
          name: 'app.status.query',
          component: 'statusQuery'
        });
    });
  });

  describe('table state', () => {
    it('should create the state', () => {
      expect(mod.tableState)
        .toEqual({
          name: 'app.status.query.table',
          url: noSpace`/status?
            severity__in&severity__contains&severity__startswith&severity__endswith&
            severity__gte&severity__gt&severity__lte&severity__lt&
            record_type__in&record_type__contains&record_type__startswith&
            record_type__endswith&record_type__gte&record_type__gt&
            record_type__lte&record_type__lt&active__in&active__contains&
            active__startswith&active__endswith&active__gte&active__gt&active__lte&
            active__lt&offset__in&offset__contains&offset__startswith&offset__endswith&
            offset__gte&offset__gt&offset__lte&offset__lt&limit__in&limit__contains&limit__startswith&
            limit__endswith&limit__gte&limit__gt&limit__lte&limit__lt&order_by__in&
            order_by__contains&order_by__startswith&order_by__endswith&order_by__gte
            &order_by__gt&order_by__lte&order_by__lt&begin__in&begin__contains&
            begin__startswith&begin__endswith&begin__gte&begin__gt&begin__lte&
            begin__lt&end__in&end__contains&end__startswith&end__endswith&
            end__gte&end__gt&end__lte&end__lt&severity&
            record_type&active&offset&limit&order_by&begin&end`,
          params: {
            resetState: {
              dynamic: true,
              value: true,
              squash: true
            }
          },
          data: {
            kind: 'Status',
            icon: 'fa-tachometer'
          },
          resolve: {
            notification$: jasmine.any(Function)
          },
          component: 'statusRecords'
        });
    });

    describe('resolve', function () {
      var qsFromLocation, notification$, $stateParams;

      beforeEach(() => {
        resolveStream
          .and
          .returnValue('promise');

        socketStream
          .and
          .returnValue('socket');

        $stateParams = {
          foo: 'bar',
          baz__in: ['1', '2'],
          bap: '3',
          bim__in: ['4', '5', '6']
        };

        qsFromLocation = jasmine.createSpy('qsFromLocation');

        notification$ = mod.tableState.resolve.notification$;
      });

      it('should call /alert with a qs', () => {
        qsFromLocation
          .and
          .returnValue('foo=bar&baz__in=1,2&bap=3&bim__in=4,5,6');

        notification$(qsFromLocation, $stateParams);

        expect(socketStream)
          .toHaveBeenCalledOnceWith('/alert/?foo=bar&baz__in=1&baz__in=2&bap=3&bim__in=4&bim__in=5&bim__in=6');
      });

      it('should call /alert without a qs', () => {
        qsFromLocation
          .and
          .returnValue('');

        notification$(qsFromLocation);

        expect(socketStream).toHaveBeenCalledOnceWith('/alert/');
      });

      it('should call resolveStream with socket', () => {
        qsFromLocation
          .and
          .returnValue('');

        notification$(qsFromLocation);

        expect(resolveStream).toHaveBeenCalledOnceWith('socket');
      });

      it('should resolve the stream', () => {
        qsFromLocation
          .and
          .returnValue('');

        const res = notification$(qsFromLocation);

        expect(res).toBe('promise');
      });
    });

  });
});
