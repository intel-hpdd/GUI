import { noSpace } from '../../../../source/iml/string.js';

describe('status states', () => {
  let mod, mockResolveStream, mockSocketStream;

  beforeEach(() => {
    jest.resetModules();
    mockResolveStream = jest.fn();
    mockSocketStream = jest.fn();

    jest.mock('../../../../source/iml/promise-transforms.js', () => ({
      resolveStream: mockResolveStream
    }));
    jest.mock(
      '../../../../source/iml/socket/socket-stream.js',
      () => mockSocketStream
    );

    mod = require('../../../../source/iml/status/status-states.js');
  });

  afterEach(() => {
    window.angular = null;
  });

  describe('status state', () => {
    it('should create the state', () => {
      expect(mod.statusState).toEqual({
        name: 'app.status',
        data: {
          helpPage: 'status_page.htm',
          anonymousReadProtected: true,
          eulaState: true
        },
        template: expect.any(String)
      });
    });
  });

  describe('query state', () => {
    it('should create the state', () => {
      expect(mod.queryState).toEqual({
        name: 'app.status.query',
        component: 'statusQuery'
      });
    });
  });

  describe('table state', () => {
    it('should create the state', () => {
      expect(mod.tableState).toEqual({
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
          notification$: expect.any(Function)
        },
        component: 'statusRecords'
      });
    });

    describe('resolve', () => {
      let qsFromLocation, notification$, $stateParams;

      beforeEach(() => {
        mockResolveStream.mockReturnValue('promise');

        mockSocketStream.mockReturnValue('socket');

        $stateParams = {
          foo: 'bar',
          baz__in: ['1', '2'],
          bap: '3',
          bim__in: ['4', '5', '6']
        };

        qsFromLocation = jest.fn();

        notification$ = mod.tableState.resolve.notification$;
      });

      it('should call /alert with a qs', () => {
        qsFromLocation.mockReturnValue(
          'foo=bar&baz__in=1%2C2&bap=3&bim__in=4%2C5%2C6'
        );

        notification$(qsFromLocation, $stateParams);

        expect(mockSocketStream).toHaveBeenCalledOnceWith(
          '/alert/?foo=bar&baz__in=1&baz__in=2&bap=3&bim__in=4&bim__in=5&bim__in=6'
        );
      });

      it('should call /alert without a qs', () => {
        qsFromLocation.mockReturnValue('');

        notification$(qsFromLocation);

        expect(mockSocketStream).toHaveBeenCalledOnceWith('/alert/');
      });

      it('should call resolveStream with socket', () => {
        qsFromLocation.mockReturnValue('');

        notification$(qsFromLocation);

        expect(mockResolveStream).toHaveBeenCalledOnceWith('socket');
      });

      it('should resolve the stream', () => {
        qsFromLocation.mockReturnValue('');

        const res = notification$(qsFromLocation);

        expect(res).toBe('promise');
      });
    });
  });
});
