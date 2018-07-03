import { noSpace } from '../../../../source/iml/string.js';
import highland from 'highland';

describe('status states', () => {
  let mod, mockResolveStream, mockSocketStream, mockAddCurrentPage, mockStore, storeStream;

  beforeEach(() => {
    mockResolveStream = jest.fn(() => 'promise');
    mockSocketStream = jest.fn(() => highland(['socket']));
    mockAddCurrentPage = jest.fn();

    jest.mock('../../../../source/iml/promise-transforms.js', () => ({
      resolveStream: mockResolveStream
    }));
    jest.mock('../../../../source/iml/socket/socket-stream.js', () => mockSocketStream);
    jest.mock('../../../../source/iml/api-transforms.js', () => ({
      addCurrentPage: mockAddCurrentPage
    }));

    storeStream = highland();
    mockStore = {
      select: jest.fn(() => storeStream)
    };
    jest.mock('../../../../source/iml/store/get-store.js', () => mockStore);

    mod = require('../../../../source/iml/logs/log-states.js');
  });

  describe('log state', () => {
    it('should create the state ', () => {
      expect(mod.logState).toEqual({
        name: 'app.log',
        data: {
          helpPage: 'Graphical_User_Interface_9_0.html#9.5',
          anonymousReadProtected: true
        },
        resolve: {
          tzPickerB: expect.any(Function)
        },
        component: 'logQuery'
      });
    });
  });

  describe('log table state', () => {
    it('should create the state', () => {
      expect(mod.logTableState).toEqual({
        name: 'app.log.table',
        url: noSpace`/log?message_class__in&message_class__contains&message_class__startswith&
            message_class__endswith&message_class__gte&message_class__gt&
            message_class__lte&message_class__lt&message__in&message__contains&
            message__startswith&message__endswith&message__gte&
            message__gt&message__lte&message__lt&tag__in&tag__contains&
            tag__startswith&tag__endswith&tag__gte&tag__gt&tag__lte&
            tag__lt&fqdn__in&fqdn__contains&fqdn__startswith&
            fqdn__endswith&fqdn__gte&fqdn__gt&fqdn__lte&fqdn__lt&
            datetime__in&datetime__contains&datetime__startswith&datetime__endswith&
            datetime__gte&datetime__gt&datetime__lte&datetime__lt&offset__in&
            offset__contains&offset__startswith&offset__endswith&offset__gte&
            offset__gt&offset__lte&offset__lt&limit__in&limit__contains&limit__startswith&
            limit__endswith&limit__gte&limit__gt&limit__lte&limit__lt&order_by__in&
            order_by__contains&order_by__startswith&order_by__endswith&order_by__gte&
            order_by__gt&order_by__lte&order_by__lt&
            message_class&message&tag&fqdn&datetime&offset&limit&order_by`,
        params: {
          resetState: {
            dynamic: true
          }
        },
        resolve: {
          log$: expect.any(Function),
          tzPickerB: expect.any(Function)
        },
        data: {
          kind: 'Logs',
          icon: 'fa-book'
        },
        component: 'logTable'
      });
    });

    describe('resolve', () => {
      let qsFromLocation, $stateParams, log$;

      beforeEach(() => {
        qsFromLocation = jest.fn();
        $stateParams = {
          param: 'val'
        };

        log$ = mod.logTableState.resolve.log$;
      });

      it('should call /log with a qs', () => {
        qsFromLocation.mockReturnValue('foo=bar&baz__in=1%2C2&bap=3&bim__in=4%2C5%2C6');

        log$(qsFromLocation, $stateParams);

        expect(mockSocketStream).toHaveBeenCalledOnceWith(
          '/log/?foo=bar&baz__in=1&baz__in=2&bap=3&bim__in=4&bim__in=5&bim__in=6'
        );
      });

      it('should call /log without a qs', () => {
        qsFromLocation.mockReturnValue('');

        log$(qsFromLocation);

        expect(mockSocketStream).toHaveBeenCalledOnceWith('/log/');
      });

      it('should resolve the stream', () => {
        qsFromLocation.mockReturnValue('');

        const res = log$(qsFromLocation);

        expect(res).toBe('promise');
      });
    });
  });
});
