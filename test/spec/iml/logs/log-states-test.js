import {
  mock,
  resetAll
} from '../../../system-mock.js';

import {
  noSpace
} from '../../../../source/iml/string.js';

describe('status states', () => {
  let mod, resolveStream, socketStream, addCurrentPage;

  beforeEachAsync(async function () {
    resolveStream = jasmine.createSpy('resolveStream');
    socketStream = jasmine.createSpy('socketStream');
    addCurrentPage = jasmine.createSpy('addCurrentPage');

    mod = await mock('source/iml/logs/log-states.js', {
      'source/iml/promise-transforms.js': {
        resolveStream
      },
      'source/iml/socket/socket-stream.js': {
        default: socketStream
      },
      'source/iml/api-transforms.js': {
        addCurrentPage
      }
    });
  });

  afterEach(resetAll);

  describe('log state', () => {
    it('should create the state ', () => {
      expect(mod.logState)
        .toEqual({
          name: 'app.log',
          data: {
            helpPage: 'logs_page.htm',
            anonymousReadProtected: true,
            eulaState: true,
            skipWhen: jasmine.any(Function)
          },
          template: jasmine.any(String)
        });
    });
  });

  describe('log table state', () => {
    it('should create the state', () => {
      expect(mod.logTableState)
        .toEqual({
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
          resolve: {
            log$: jasmine.any(Function)
          },
          component: 'logTable'
        });
    });

    describe('resolve', () => {
      var qsFromLocation, log$;

      beforeEach(() => {
        resolveStream
          .and
          .returnValue('promise');

        socketStream
          .and
          .returnValue('socket');

        qsFromLocation = jasmine.createSpy('qsFromLocation');

        log$ = mod.logTableState.resolve.log$;
      });

      it('should call /alert with a qs', () => {
        qsFromLocation.and.returnValue('foo=bar&baz__in=1,2&bap=3&bim__in=4,5,6');

        log$(qsFromLocation);

        expect(socketStream)
          .toHaveBeenCalledOnceWith('/log/?foo=bar&baz__in=1&baz__in=2&bap=3&bim__in=4&bim__in=5&bim__in=6');
      });

      it('should call /alert without a qs', () => {
        qsFromLocation.and.returnValue('');

        log$(qsFromLocation);

        expect(socketStream)
          .toHaveBeenCalledOnceWith('/log/');
      });

      it('should resolve the stream', () => {
        qsFromLocation.and.returnValue('');

        const res = log$(qsFromLocation);

        expect(res).toBe('promise');
      });
    });
  });
});
